<script lang="ts">
  import { fly } from "svelte/transition";
  import type { StringTableResource as StblResourceType } from "@s4tk/models";
  import type { ResourceKey } from "@s4tk/models/types";
  import FileInput from "src/components/elements/FileInput.svelte";

  const { StringTableResource, Package } = window.S4TK.models;
  const { BinaryResourceType, StringTableLocale } = window.S4TK.enums;
  const { Buffer } = window.S4TK.Node;

  let files: FileList;
  let filesInvalid = false;
  let batchFixResult: BatchFixResult;
  let replacements: Replacement[];

  export let numStblsToRead: number;
  export let isReadingFiles: boolean;
  export let onFilesRead: (result: BatchFixResult) => void;
  export let possibleReplacements: {
    male: string;
    female: string;
    token: string;
    checked: boolean;
  }[];

  $: {
    if (files) {
      isReadingFiles = true;

      replacements = [];

      possibleReplacements.forEach((option) => {
        if (option.checked) {
          replacements.push(
            ...getReplacements(option.male, option.female, option.token)
          );
        }
      });

      parseFiles();
    }
  }

  //#region Patterns & Replacements

  function getPatterns(m: string, f: string): string[] {
    return [
      `\\{M\\d.${m}\\}\\{F(?<n>[\\d])\\.${f}\\}`,
      `\\{F(?<n>[\\d])\\.${f}\\}\\{M\\d.${m}\\}`,
    ];
  }

  function getReplacements(m: string, f: string, token: string): Replacement[] {
    return [
      {
        patterns: getPatterns(m.toLowerCase(), f.toLowerCase()),
        result: `{#.${token}}`,
      },
      {
        patterns: getPatterns(m, f),
        result: `{#.${token}|xxUpper}`,
      },
      {
        patterns: getPatterns(m.toUpperCase(), f.toUpperCase()),
        result: `{#.${token}|xxAllCaps}`,
      },
    ];
  }

  //#endregion Patterns and Replacements

  //#region Functions

  async function parseFiles() {
    filesInvalid = false;

    const stbls: KeyStblPair[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        stbls.push(...extractStbls(file.name, buffer));
      } catch (err) {
        console.error(err);
      }
    }

    numStblsToRead = stbls.length;

    if (stbls.length === 0) {
      filesInvalid = true;
      isReadingFiles = false;
      numStblsToRead = null;
    } else {
      batchFixResult = [];

      stbls.forEach((stbl) => {
        batchFixResult.push({
          stbl,
          changes: fixStringTable(stbl.value),
        });
      });

      onFilesRead(batchFixResult);
    }
  }

  function extractStbls(filename: string, buffer: Buffer): KeyStblPair[] {
    const ext = filename.split(".").at(-1);

    if (ext === "package") {
      return Package.extractResources(buffer, {
        resourceFilter(type, group, instance) {
          return (
            type === BinaryResourceType.StringTable &&
            StringTableLocale.getLocale(instance) === StringTableLocale.English
          );
        },
      }) as KeyStblPair[];
    } else {
      const key = getKeyFromFilename(filename);
      return [
        {
          key,
          value: StringTableResource.from(buffer),
        },
      ];
    }
  }

  function fixStringTable(stbl: StblResourceType): StringChange[] {
    const changes: StringChange[] = [];

    stbl.entries.forEach((entry) => {
      const stringChange = fixEntry(entry);
      if (stringChange) changes.push(stringChange);
    });

    return changes;
  }

  function fixEntry(entry: { key: number; value: string }): StringChange {
    let result = entry.value;
    let from = entry.value;
    let to = entry.value;

    replacements.forEach((replacement) => {
      replacement.patterns.forEach((pattern) => {
        const regex = new RegExp(pattern, "g");

        let match: RegExpExecArray;
        let indices: string[] = [];

        while ((match = regex.exec(entry.value)) != null) {
          indices.push(match.groups.n);
        }

        indices.forEach((index) => {
          const newToken = replacement.result.replace("#", index);

          result = result.replace(regex, newToken);

          from = from.replace(regex, (match) => {
            return `<span class="text-red-500 dark:text-red-400 font-bold">${match}</span>`;
          });

          to = to.replace(
            regex,
            `<span class="text-emerald-500 dark:text-emerald-400 font-bold">${newToken}</span>`
          );
        });
      });
    });

    if (result === entry.value) {
      return undefined;
    } else {
      entry.value = result;

      return {
        key: entry.key,
        from,
        to,
      };
    }
  }

  function getKeyFromFilename(filename: string): ResourceKey {
    try {
      const { t, g, i } =
        /(?<t>[a-fA-F\d]{8})[_!]?(?<g>[a-fA-F\d]{8})[_!]?(?<i>[a-fA-F\d]{16})/.exec(
          filename
        ).groups;

      return {
        type: parseInt(t, 16),
        group: parseInt(g, 16),
        instance: BigInt("0x" + i),
      };
    } catch (e) {
      return {
        type: BinaryResourceType.StringTable,
        group: 0,
        instance: 0n,
      };
    }
  }

  //#endregion Functions
</script>

<div class="mt-8 mb-6">
  <FileInput
    bind:files
    multiple={true}
    label="STBLs and/or Packages only"
    accept=".binary,.bnry,.stbl,.package"
    errorMessage={filesInvalid ? "No English STBLs found" : ""}
  />
  {#if isReadingFiles}
    <p class="mt-8 mb-0" in:fly={{ y: -20, duration: 250 }}>
      Reading your files...
    </p>
  {/if}
</div>

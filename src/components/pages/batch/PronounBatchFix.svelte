<script lang="ts">
  import type { StringTableResource as StblResourceType } from "@s4tk/models";
  import type { ResourceKey } from "@s4tk/models/types";
  import FileInput from "../../elements/FileInput.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";

  const { StringTableResource, Package } = window.S4TK.models;
  const { BinaryResourceType, StringTableLocale } = window.S4TK.enums;
  const { formatResourceKey, formatStringKey } = window.S4TK.formatting;
  const { Buffer } = window.S4TK.Node;

  interface KeyStblPair {
    key: ResourceKey;
    value: StblResourceType;
  }

  interface StringChange {
    key: number;
    from: string;
    to: string;
  }

  type BatchFixResult = {
    stbl: KeyStblPair;
    changes: StringChange[];
  }[];

  function getPatterns(m: string, f: string) {
    return [
      `\\{M\\d.${m}\\}\\{F(?<n>[\\d])\\.${f}\\}`,
      `\\{F(?<n>[\\d])\\.${f}\\}\\{M\\d.${m}\\}`,
    ];
  }

  function getReplacements(m: string, f: string, token: string) {
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

  const replacements = [
    ...getReplacements("Him", "Her", "SimPronounObjective"),
    ...getReplacements("His", "Her", "SimPronounPossessiveDependent"),
    ...getReplacements("His", "Hers", "SimPronounPossessiveIndependent"),
  ];

  let files: FileList;
  let filesInvalid = false;
  let batchFixResult: BatchFixResult;

  $: currentStep = batchFixResult ? 2 : 1;

  $: {
    if (files) parseFiles();
  }

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

    if (stbls.length === 0) {
      filesInvalid = true;
    } else {
      batchFixResult = [];

      stbls.forEach((stbl) => {
        batchFixResult.push({
          stbl,
          changes: fixStringTable(stbl.value),
        });
      });
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
            return `<span class="error-color bold">${match}</span>`;
          });

          to = to.replace(
            regex,
            `<span class="success-color bold">${newToken}</span>`
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
</script>

<svelte:head>
  <title>STBL Studio | Pronoun Batch Fix</title>
</svelte:head>
<section id="pronoun-batch-fix">
  <ContentArea banded={true}>
    <GradientHeader title="Pronoun Batch Fix" />
    <div class="mt-2">
      <p class="small-title mt-0">The Problem</p>
      <p>
        The pronoun update is here, and there are new tokens to use instead of
        M/F. Most M/F tokens still work, as the game automatically replaces them
        at runtime. However, there are some issues. For instance, it doesn't
        always know what to do with <code>{"{F#.her}"}</code> and
        <code>{"{M#.his}"}</code>, since they each have two different meanings.
        So, this tool will replace all his/her tokens with their new
        equivalents.
      </p>
    </div>
    <div class="my-2">
      <p class="small-title mt-0 mb-1">The Solution</p>
      <ol>
        <li class="mb-half">
          Upload your strings to this website, either in string table binaries
          or packages.
        </li>
        <li class="mb-half">
          All English string tables will be extracted from your uploaded files,
          and their strings will be replaced as needed.
        </li>
        <li>
          When the batch fix is done, you can review the changes that were made
          and download your updated string tables.
        </li>
      </ol>
    </div>
    <p class="subtle-text my-0">
      Note that this tool will <strong>not</strong> correct verb conjugation (i.e.
      "they is" &rarr; "they are"), as there is currently no way to do so.
    </p>
  </ContentArea>
  <ContentArea>
    <GradientHeader title="1) Upload Your String Tables" />
    <div class="my-2">
      <FileInput
        bind:files
        multiple={true}
        label="STBLs and/or Packages only"
        accept=".binary,.bnry,.stbl,.package"
        {filesInvalid}
        errorMessage="No English STBLs found"
      />
    </div>
    <div class="py-2">
      {#if batchFixResult}
        {#each batchFixResult as stblSummary, key (key)}
          <div class="mb-1">
            <GradientHeader
              title={formatResourceKey(stblSummary.stbl.key, "-")}
            />
          </div>

          {#each stblSummary.changes as change, key (key)}
            <div class="change-container drop-shadow mb-1">
              <h4 class="mt-0">{formatStringKey(change.key)}</h4>
              <div class="comparison flex-space-between flex-gap">
                <div>
                  <p class="small-title my-0">Before</p>
                  <p class="subtle-text text-color mt-half mb-0">
                    {@html change.from}
                  </p>
                </div>
                <div>
                  <p class="small-title my-0">After</p>
                  <p class="subtle-text text-color mt-half mb-0">
                    {@html change.to}
                  </p>
                </div>
              </div>
            </div>
          {/each}
        {/each}
      {/if}
    </div>
  </ContentArea>
  {#if currentStep >= 2}
    <ContentArea banded={true}>
      <p>Hello</p>
    </ContentArea>
  {/if}
</section>

<style lang="scss">
  section#pronoun-batch-fix {
    .change-container {
      background-color: var(--color-card);
      border-radius: 8px;
      padding: 1em;
    }

    .comparison > div {
      flex: 1;
    }
  }
</style>

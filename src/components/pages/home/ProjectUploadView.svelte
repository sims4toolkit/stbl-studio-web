<script lang="ts">
  import type { ResourceKey } from "@s4tk/models/types";
  import type { KeyStringPair } from "@s4tk/models/lib/resources/stbl/types";
  import { fly } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import type { StringTableWrapper } from "../../../global";
  import Project from "../../../typescript/models/project";
  import FileInput from "../../elements/FileInput.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import NavigationButton from "../../elements/NavigationButton.svelte";
  import ProgressCircles from "../../elements/ProgressCircles.svelte";

  const { BinaryResourceType, StringTableLocale } = window.S4TK.enums;
  const { Package, StringTableResource } = window.S4TK.models;
  const { Buffer } = window.S4TK.Node;

  export let onComplete: (project?: Project) => void;

  const animationDuration = 1000;

  const uuid: string = uuidv4();
  let uploadedFiles: FileList;
  let filesInvalid = false;
  let circlesFilled = 0;

  interface StblWithKey {
    key: ResourceKey;
    stbl: StringTableWrapper;
  }

  $: {
    if (uploadedFiles?.length) {
      const file = uploadedFiles[0];

      readFile(file);

      if (!file) onComplete(); // TODO: shut up
    }
  }

  async function readFile(file: File) {
    const ext = file.name.split(".").at(-1);
    const buffer = Buffer.from(await file.arrayBuffer());

    if (ext === "json") {
      var stbls = [readJson(buffer, file.name)];
    } else if (ext === "package") {
      var stbls = readDbpf(buffer);
    } else {
      var stbls = [readStbl(buffer, file.name)];
    }

    const primaryLocale = StringTableLocale.English;

    const primaryStbl = stbls.find(
      (stbl) => stbl.stbl.locale === primaryLocale
    );

    const project = new Project({
      group: primaryStbl.key.group,
      instanceBase: primaryStbl.key.instance & 0xffffffffffffffn,
      name: file.name,
      primaryLocale,
      stbls: stbls.map((stbl) => stbl.stbl),
      uuid,
    });

    onComplete(project);
  }

  function readJson(buffer: Buffer, name: string): StblWithKey {
    const json: KeyStringPair[] = JSON.parse(buffer.toString()).map((entry) => {
      return {
        key:
          typeof entry.key === "number" ? entry.key : parseInt(entry.key, 16),
        value: entry.value ?? entry.string,
      };
    });

    const key = getTgi(name);

    return {
      key,
      stbl: {
        locale: StringTableLocale.getLocale(key.instance),
        stbl: new StringTableResource(json),
      },
    };
  }

  function readStbl(buffer: Buffer, name: string): StblWithKey {
    const key = getTgi(name);

    return {
      key,
      stbl: {
        locale: StringTableLocale.getLocale(key.instance),
        stbl: StringTableResource.from(buffer),
      },
    };
  }

  function readDbpf(buffer: Buffer): StblWithKey[] {
    return Package.extractResources(buffer, {
      resourceFilter(type) {
        return type === BinaryResourceType.StringTable;
      },
    }).map(({ key, value }) => {
      return {
        key,
        stbl: {
          locale: StringTableLocale.getLocale(key.instance),
          stbl: value as any,
        },
      };
    });
  }

  function getTgi(filename: string) {
    const { t, g, i } =
      /(?<t>[a-fA-F\d]{8})[_!]?(?<g>[a-fA-F\d]{8})[_!]?(?<i>[a-fA-F\d]{16})/.exec(
        filename
      ).groups;

    return {
      type: parseInt(t, 16),
      group: parseInt(g, 16),
      instance: BigInt("0x" + i),
    };
  }

  function nextClicked() {
    // TODO:
  }
</script>

<div>
  <div in:fly={{ y: -15, duration: animationDuration }}>
    <GradientHeader title="Upload Project" />
    <p class="mt-1 subtle-text">UUID: {uuid}</p>
  </div>
  <div in:fly={{ y: 15, duration: animationDuration }}>
    <p class="my-2">
      Upload the string table(s) you'd like to include in this project. A single
      string table can be uploaded as binary or JSON, but multiple string tables
      must be uploaded in a package.
    </p>
    <FileInput
      label="binary, json, or package only"
      bind:files={uploadedFiles}
      accept=".json,.stbl,.bnry,.binary,.package"
      bind:filesInvalid
    />
    <div class="my-2">
      <p class="subtle-text">
        If multiple string tables have the same locale, they will be merged.
      </p>
      <p class="subtle-text">
        Using JSON? Read about the expected structure <a
          href="#/help?title=json"
          target="_blank">here</a
        >.
      </p>
    </div>
  </div>
  <div
    class="flex-space-between"
    in:fly={{ y: 25, duration: animationDuration }}
  >
    <ProgressCircles circles={2} filled={circlesFilled} />
    <NavigationButton
      text="Next"
      direction="right"
      onClick={nextClicked}
      active={true}
    />
  </div>
</div>

<style lang="scss">
  // intentionally blank
</style>

<script lang="ts">
  import { onDestroy } from "svelte";
  import type { StringTableResource as StblType } from "@s4tk/models";
  import type { ResourceKey } from "@s4tk/models/types";
  import { fly } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import Project from "../../../typescript/models/project";
  import FileInput from "../../shared/elements/FileInput.svelte";
  import GradientHeader from "../../shared/elements/GradientHeader.svelte";
  import NavigationButton from "../../shared/elements/NavigationButton.svelte";
  import ProgressCircles from "../../shared/controls/ProgressCircles.svelte";
  import type Workspace from "../../../typescript/models/workspace";
  import { activeWorkspace } from "../../../typescript/stores";
  import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
  import type { StblMap } from "../../../global";
  import { Settings } from "../../../typescript/storage";
  import { subscribeToKey } from "../../../typescript/keybindings";

  const { BinaryResourceType, StringTableLocale } = window.S4TK.enums;
  const { Package, StringTableResource } = window.S4TK.models;
  const { Buffer } = window.S4TK.Node;

  export let onComplete: () => void;

  const animationDuration = Settings.reduceMotion ? 0 : 1000;

  const uuid: string = uuidv4();
  let uploadedFiles: FileList;
  let filesInvalid = false;
  let circlesFilled = 0;

  let workspace: Workspace;
  const unsubscribe = activeWorkspace.subscribe((value) => {
    workspace = value;
  });

  const unsubscribeKeyEsc = subscribeToKey("Escape", onComplete);

  onDestroy(() => {
    unsubscribe();
    unsubscribeKeyEsc();
  });

  interface StblWithKey {
    key: ResourceKey;
    value: StblType;
  }

  $: {
    if (uploadedFiles?.length) {
      const file = uploadedFiles[0];

      createProject(file);
    }
  }

  async function createProject(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const project = readDbpf(file.name, buffer);
    workspace.addProject(project);
    onComplete();
  }

  // function getPackage(ext: string, buffer: Buffer): PackageType {
  //   if (ext === "package") return Package.from(buffer);

  //   const stbl = read;
  //   if (ext === "json") {
  //     var stbls = [readJson(buffer, file.name)];
  //   } else {
  //     var stbls = [readStbl(buffer, file.name)];
  //   }

  //   const primaryLocale = StringTableLocale.English;

  //   const primaryStbl = stbls.find(
  //     (stbl) => stbl.stbl.locale === primaryLocale
  //   );

  //   const project = new Project({
  //     group: primaryStbl.key.group,
  //     instanceBase: primaryStbl.key.instance & 0xffffffffffffffn,
  //     name: file.name,
  //     primaryLocale,
  //     uuid,
  //   });

  //   onComplete(project);
  // }

  // function readJson(buffer: Buffer, name: string): StblWithKey {
  //   const json: KeyStringPair[] = JSON.parse(buffer.toString()).map((entry) => {
  //     return {
  //       key:
  //         typeof entry.key === "number" ? entry.key : parseInt(entry.key, 16),
  //       value: entry.value ?? entry.string,
  //     };
  //   });

  //   const key = getTgi(name);

  //   return {
  //     key,
  //     stbl: new StringTableResource(json),
  //   };
  // }

  // function readStbl(buffer: Buffer, name: string): StblWithKey {
  //   const key = getTgi(name);

  //   return {
  //     key,
  //     stbl: new StringTableResource(json),
  //   };
  // }

  function readDbpf(filename: string, buffer: Buffer): Project {
    const allStbls: StblWithKey[] = Package.extractResources(buffer, {
      resourceFilter(type) {
        return type === BinaryResourceType.StringTable;
      },
    }) as unknown as StblWithKey[];

    const primaryEntry = allStbls.find(
      (entry) =>
        StringTableLocale.getLocale(entry.key.instance) ===
        StringTableLocale.English
    );

    const primaryStbl = primaryEntry.value as StblType;

    allStbls.forEach(({ key, value }) => {
      if (value === primaryStbl) return;
      (value as StblType).entries.forEach((entry) => {
        if (entry.valueEquals(primaryStbl.getByKey(entry.key)?.value)) {
          (value as StblType).deleteByKey(entry.key);
        }
      });
    });

    const stblMap: StblMap = new Map();

    allStbls.forEach(({ key, value }) => {
      stblMap.set(StringTableLocale.getLocale(key.instance), value);
    });

    return new Project(
      {
        uuid,
        name: filename,
        group: primaryEntry.key.group,
        instanceBase: StringTableLocale.getInstanceBase(
          primaryEntry.key.instance
        ),
        primaryLocale: StringTableLocale.English,
      },
      stblMap
    );
  }

  // function getTgi(filename: string) {
  //   try {
  //     const { t, g, i } =
  //       /(?<t>[a-fA-F\d]{8})[_!]?(?<g>[a-fA-F\d]{8})[_!]?(?<i>[a-fA-F\d]{16})/.exec(
  //         filename
  //       ).groups;

  //     return {
  //       type: parseInt(t, 16),
  //       group: parseInt(g, 16),
  //       instance: BigInt("0x" + i),
  //     };
  //   } catch (e) {
  //     return {
  //       type: BinaryResourceType.StringTable,
  //       group: 0,
  //       instance: 0n,
  //     };
  //   }
  // }

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
    <ProgressCircles circles={2} currentPage={1} filled={circlesFilled} />
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

<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import type Project from "../../../typescript/models/project";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import FloatingActionButtonGroup from "../../shared/controls/FloatingActionButtonGroup.svelte";

  const { fnv32 } = window.S4TK.hashing;

  export let disabledText: string;
  export let disabled: boolean;
  export let isSelecting: boolean;
  export let project: Project;

  const normalModeToolbar = [
    {
      title: "save stbl",
      icon: "desktop-download",
      color: ToolbarColor.Download,
      async onClick() {
        alert("button clicked");
      },
    },
    {
      title: "import strings",
      icon: "upload",
      color: ToolbarColor.Upload,
      async onClick() {
        alert("button clicked");
      },
    },
    {
      title: "new string",
      icon: "plus",
      color: ToolbarColor.Create,
      async onClick() {
        const key = fnv32(uuidv4());
        project.addEntry(key, "");
        project = project;
      },
    },
  ];

  const selectModeToolbar = [
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      async onClick() {
        alert("button clicked");
      },
    },
    {
      title: "merge",
      icon: "git-merge",
      color: ToolbarColor.Merge,
      async onClick() {
        alert("Merge Clicked");
      },
    },
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      async onClick() {
        alert("Download Clicked");
      },
    },
  ];

  $: buttonData = isSelecting ? selectModeToolbar : normalModeToolbar;
</script>

<FloatingActionButtonGroup {buttonData} {disabled} {disabledText} />

<style lang="scss">
  // intentionally blank
</style>

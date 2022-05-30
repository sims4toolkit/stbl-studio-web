<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import type Project from "../../../typescript/models/project";
  import type SelectionGroup from "../../../typescript/models/selection-group";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import FloatingActionButtonGroup from "../../shared/controls/FloatingActionButtonGroup.svelte";
  import type { StringEntry } from "@s4tk/models/types";

  const { fnv32 } = window.S4TK.hashing;

  // = null to silence warning
  export let project: Project = null;
  export let selectionGroup: SelectionGroup<StringEntry, number> = null;
  export let createNewStringEntry: () => void;
  export let deleteStringEntry: () => void;

  $: disabledText = project ? "none selected" : "no project";
  $: disabled = selectionGroup?.noneSelected;

  const normalModeToolbar = [
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      async onClick() {
        alert("button clicked");
      },
    },
    {
      title: "import strings",
      icon: "import",
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
        createNewStringEntry();
      },
    },
  ];

  const selectModeToolbar = [
    {
      title: "delete strings",
      icon: "trash",
      color: ToolbarColor.Delete,
      async onClick() {
        deleteStringEntry();
      },
    },
    {
      title: "export strings",
      icon: "export",
      color: ToolbarColor.Merge,
      async onClick() {
        alert("Export Clicked");
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

  $: buttonData = selectionGroup?.selectMode
    ? selectModeToolbar
    : normalModeToolbar;
</script>

<FloatingActionButtonGroup {buttonData} {disabled} {disabledText} />

<style lang="scss">
  // intentionally blank
</style>

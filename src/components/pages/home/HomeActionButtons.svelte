<script lang="ts">
  import type { FloatingActionButtonData } from "../../../global";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import FloatingActionButtonGroup from "../../shared/controls/FloatingActionButtonGroup.svelte";

  export let inModal: boolean;
  export let inSelectMode: boolean;
  export let numSelected: number;
  export let onAction: (action: HomeAction) => void;

  let buttonData: FloatingActionButtonData[];

  $: disabled = inModal || (inSelectMode && numSelected < 1);

  const normalButtonData: FloatingActionButtonData[] = [
    {
      title: "save workspace",
      icon: "desktop-download",
      color: ToolbarColor.Download,
      keybinding: "s",
      async onClick() {
        onAction("save-workspace");
      },
    },
    {
      title: "upload files",
      icon: "upload",
      color: ToolbarColor.Upload,
      keybinding: "u",
      async onClick() {
        onAction("upload");
      },
    },
    {
      title: "new project",
      icon: "plus",
      color: ToolbarColor.Create,
      keybinding: "n",
      async onClick() {
        onAction("create");
      },
    },
  ];

  const selectModeButtonData: FloatingActionButtonData[] = [
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      keybinding: "d",
      async onClick() {
        onAction("delete");
      },
    },
    {
      title: "merge",
      icon: "git-merge",
      keybinding: "m",
      color: ToolbarColor.Merge,
      async onClick() {
        onAction("merge");
      },
    },
    {
      title: "download",
      icon: "download",
      keybinding: "s",
      color: ToolbarColor.Download,
      async onClick() {
        onAction("download");
      },
    },
  ];

  const mergeButtonData = selectModeButtonData[1];

  $: {
    inSelectMode;
    numSelected;

    mergeButtonData.disabled = inSelectMode && numSelected < 2;
    mergeButtonData.disabledTitle = mergeButtonData.disabled
      ? "only 1 selected"
      : null;

    buttonData = inSelectMode ? selectModeButtonData : normalButtonData;
  }
</script>

<FloatingActionButtonGroup
  {buttonData}
  {disabled}
  disabledTitle="none selected"
/>

<style lang="scss">
  // intentionally blank
</style>

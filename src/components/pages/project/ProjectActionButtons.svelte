<script lang="ts">
  import type { FloatingActionButtonData } from "../../../global";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import FloatingActionButtonGroup from "../../shared/controls/FloatingActionButtonGroup.svelte";

  export let inModal: boolean;
  export let inSelectMode: boolean;
  export let canAddStrings: boolean;
  export let numSelected: number;
  export let onAction: (action: ProjectAction) => void;

  $: disabled = inModal || (inSelectMode && numSelected < 1);

  const normalButtonData: FloatingActionButtonData[] = [
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      keybinding: "s",
      async onClick() {
        onAction("download");
      },
    },
    {
      title: "import strings",
      icon: "upload",
      color: ToolbarColor.Upload,
      keybinding: "u",
      disabled: !canAddStrings,
      async onClick() {
        onAction("import");
      },
    },
    {
      title: "new string",
      icon: "plus",
      color: ToolbarColor.Create,
      keybinding: "n",
      disabled: !canAddStrings,
      async onClick() {
        onAction("create");
      },
    },
  ];

  $: {
    normalButtonData[1].disabled = !canAddStrings;
    normalButtonData[2].disabled = !canAddStrings;
  }

  const selectModeButtonData: FloatingActionButtonData[] = [
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      keybinding: "s",
      async onClick() {
        onAction("partial-download");
      },
    },
    {
      title: "rehash keys",
      icon: "refresh",
      color: ToolbarColor.Rehash,
      keybinding: "r",
      async onClick() {
        onAction("rehash");
      },
    },
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      keybinding: "d",
      async onClick() {
        onAction("delete");
      },
    },
  ];

  $: buttonData = inSelectMode ? selectModeButtonData : normalButtonData;
</script>

<FloatingActionButtonGroup {buttonData} {disabled} />

<style lang="scss">
  // intentionally blank
</style>

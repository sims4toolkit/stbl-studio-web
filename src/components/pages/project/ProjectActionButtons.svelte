<script lang="ts">
  import type { FloatingActionButtonData } from "../../../global";
  import ToolbarColor from "../../../typescript/enums/toolbar-colors";
  import FloatingActionButtonGroup from "../../shared/controls/FloatingActionButtonGroup.svelte";

  export let inModal: boolean;
  export let inSelectMode: boolean;
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
      title: "import",
      icon: "import",
      color: ToolbarColor.Upload,
      keybinding: "i",
      async onClick() {
        onAction("import");
      },
    },
    {
      title: "new string",
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
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      keybinding: "s",
      async onClick() {
        onAction("partial-download");
      },
    },
    {
      title: "export",
      icon: "export",
      color: ToolbarColor.Merge,
      keybinding: "o",
      async onClick() {
        onAction("export");
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

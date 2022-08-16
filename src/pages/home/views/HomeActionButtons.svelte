<script lang="ts">
  import FloatingActionButtonGroup from "src/components/controls/FloatingActionButtonGroup.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import DeleteProjectView from "./DeleteProjectView.svelte";
  import DownloadProjectView from "./DownloadProjectView.svelte";
  import MergeProjectView from "./MergeProjectView.svelte";
  import NewProjectView from "./NewProjectView.svelte";
  import UploadProjectView from "./UploadProjectView.svelte";

  export let inSelectMode: boolean;
  export let numSelected: number;

  const ifNotInModal = (fn: () => void) => {
    return () => {
      if (!inModal) fn();
    };
  };

  let inModal = false;
  let modalContentComponent: any;
  let modalContentArgs: object;

  $: buttonData = inSelectMode
    ? [
        {
          color: "#3F9BCC",
          title: "Download",
          icon: "download",
          keybinding: "s",
          onClick: ifNotInModal(() => {
            modalContentComponent = DownloadProjectView;
            modalContentArgs = {};
            inModal = true;
          }),
        },
        {
          color: "#BC47B7",
          title: "Merge",
          icon: "git-merge",
          keybinding: "m",
          disabled: numSelected < 2,
          onClick: ifNotInModal(() => {
            modalContentComponent = MergeProjectView;
            modalContentArgs = {};
            inModal = true;
          }),
        },
        {
          color: "#D35454",
          title: "Delete",
          icon: "trash",
          keybinding: "d",
          disabled: numSelected < 1,
          onClick: ifNotInModal(() => {
            modalContentComponent = DeleteProjectView;
            modalContentArgs = {};
            inModal = true;
          }),
        },
      ]
    : [
        {
          color: "#305EBA",
          title: "Save Workspace",
          icon: "desktop-download",
          keybinding: "s",
          onClick: ifNotInModal(() => {
            alert("save");
          }),
        },
        {
          color: "#6B5AC6",
          title: "Upload Project",
          icon: "upload",
          keybinding: "u",
          onClick: ifNotInModal(() => {
            modalContentComponent = UploadProjectView;
            modalContentArgs = {};
            inModal = true;
          }),
        },
        {
          color: "#48AD6F",
          title: "New Project",
          icon: "plus",
          keybinding: "n",
          onClick: ifNotInModal(() => {
            modalContentComponent = NewProjectView;
            modalContentArgs = {};
            inModal = true;
          }),
        },
      ];

  function onModalClose() {
    inModal = false;
    modalContentComponent = undefined;
    modalContentArgs = undefined;
  }
</script>

<FloatingActionButtonGroup {buttonData} />

{#if inModal}
  <BlurOverlay onClose={onModalClose}>
    <svelte:component this={modalContentComponent} {...modalContentArgs} />
  </BlurOverlay>
{/if}

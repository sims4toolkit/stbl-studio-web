<script lang="ts">
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import FloatingActionButtonGroup from "src/components/controls/FloatingActionButtonGroup.svelte";
  import type { FloatingActionButtonData } from "src/components/controls/types";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import DeleteProjectView from "./DeleteProjectView.svelte";
  import DownloadProjectView from "./DownloadProjectView.svelte";
  import MergeProjectView from "./MergeProjectView.svelte";
  import NewProjectView from "./NewProjectView.svelte";
  import UploadProjectView from "./UploadProjectView.svelte";

  export let selectionGroup: SelectionGroup<Project, string>;

  const ifNotInModal = (fn: () => void) => {
    return () => {
      if (!inModal) fn();
    };
  };

  let inModal = false;
  let modalContentComponent: any;
  let modalContentArgs: object;
  let buttonData: FloatingActionButtonData[];

  $: {
    buttonData = selectionGroup?.selectMode
      ? [
          {
            color: "Azure",
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
            color: "Purple",
            title: "Pin to Top",
            icon: "pin",
            keybinding: "p",
            disabled: selectionGroup.numSelected < 1,
            onClick: ifNotInModal(() => {
              alert("pin");
            }),
          },
          {
            color: "Pink",
            title: "Merge",
            icon: "git-merge",
            keybinding: "m",
            disabled: selectionGroup.numSelected < 2,
            onClick: ifNotInModal(() => {
              modalContentComponent = MergeProjectView;
              modalContentArgs = {};
              inModal = true;
            }),
          },
          {
            color: "Red",
            title: "Delete",
            icon: "trash",
            keybinding: "d",
            disabled: selectionGroup.numSelected < 1,
            onClick: ifNotInModal(() => {
              modalContentComponent = DeleteProjectView;
              modalContentArgs = {};
              inModal = true;
            }),
          },
        ]
      : [
          {
            color: "Azure",
            title: "Save Workspace",
            icon: "desktop-download",
            keybinding: "s",
            onClick: ifNotInModal(() => {
              alert("save");
            }),
          },
          {
            color: "Cyan",
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
            color: "Green",
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
  }

  function onModalClose() {
    inModal = false;
    modalContentComponent = undefined;
    modalContentArgs = undefined;
  }
</script>

<FloatingActionButtonGroup {buttonData} />

{#if inModal}
  <BlurOverlay onClose={onModalClose}>
    <svelte:component
      this={modalContentComponent}
      onComplete={onModalClose}
      {...modalContentArgs}
    />
  </BlurOverlay>
{/if}

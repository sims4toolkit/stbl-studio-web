<script lang="ts">
  import { onDestroy } from "svelte";
  import { activeWorkspaceStore } from "src/lib/services/stores";
  import type Workspace from "src/lib/models/workspace";
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import Settings from "src/lib/services/settings";
  import constants from "src/data/constants.json";
  import type { FloatingActionButtonData } from "src/components/controls/types";
  import FloatingActionButtonGroup from "src/components/controls/FloatingActionButtonGroup.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import DeleteProjectView from "src/pages/home/views/DeleteProjectView.svelte";
  import DownloadProjectView from "src/pages/home/views/DownloadProjectView.svelte";
  import MergeProjectView from "src/pages/home/views/MergeProjectView.svelte";
  import NewProjectView from "src/pages/home/views/NewProjectView.svelte";
  import UploadProjectView from "src/pages/home/views/UploadProjectView.svelte";
  import { saveAs } from "file-saver";

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
  let workspace: Workspace;

  const subscriptions = [
    activeWorkspaceStore.subscribe((wk) => {
      if (wk) workspace = wk;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  $: {
    buttonData = selectionGroup?.selectMode
      ? [
          {
            color: "Cyan",
            title: "Download",
            icon: "download",
            keybinding: "s",
            disabled: selectionGroup.numSelected < 1,
            onClick: ifNotInModal(() => {
              if (Settings.rickGif) {
                window.open(constants.links.rickRoll, "_blank");
              } else {
                modalContentComponent = DownloadProjectView;
                modalContentArgs = {
                  selectionGroup,
                };
                inModal = true;
              }
            }),
          },
          {
            color: "Orange",
            title: "Toggle Pin",
            icon: "pin",
            keybinding: "p",
            disabled: selectionGroup.numSelected < 1,
            onClick: ifNotInModal(() => {
              workspace.toggleProjectPins(selectionGroup.allSelectedItems);
            }),
          },
          // FIXME: implement project merger
          // {
          //   color: "Pink",
          //   title: "Merge",
          //   icon: "git-merge",
          //   keybinding: "m",
          //   disabled: selectionGroup.numSelected < 2,
          //   onClick: ifNotInModal(() => {
          //     modalContentComponent = MergeProjectView;
          //     modalContentArgs = {};
          //     inModal = true;
          //   }),
          // },
          {
            color: "Red",
            title: "Delete",
            icon: "trash",
            keybinding: "d",
            disabled: selectionGroup.numSelected < 1,
            onClick: ifNotInModal(() => {
              modalContentComponent = DeleteProjectView;
              modalContentArgs = {
                projects: selectionGroup.allSelectedItems,
              };
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
              if (Settings.rickGif) {
                window.open(constants.links.rickRoll, "_blank");
              } else {
                workspace.toJson().then((json) => {
                  const blob = new Blob([JSON.stringify(json)]);
                  saveAs(blob, "StblStudioWorkspace.json");
                });
              }
            }),
          },
          {
            color: "Purple",
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

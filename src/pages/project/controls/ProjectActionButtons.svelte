<script lang="ts">
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import Settings from "src/lib/services/settings";
  import constants from "src/data/constants.json";
  import type { FloatingActionButtonData } from "src/components/controls/types";
  import FloatingActionButtonGroup from "src/components/controls/FloatingActionButtonGroup.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";
  import DimmerOverlay from "src/components/layouts/DimmerOverlay.svelte";
  import NewStringModal from "src/pages/project/views/NewStringModal.svelte";
  import DeleteStringsModal from "src/pages/project/views/DeleteStringsModal.svelte";
  import RehashStringsModal from "src/pages/project/views/RehashStringsModal.svelte";
  import StblDownloadModal from "../views/StblDownloadModal.svelte";

  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;
  export let project: Project;

  const ifNotInModal = (fn: () => void) => {
    return () => {
      if (!inModal) fn();
    };
  };

  let usingBlur = false;
  let usingDimmer = false;
  let modalContentComponent: any;
  let modalContentArgs: object;
  let buttonData: FloatingActionButtonData[];

  $: inModal = usingBlur || usingDimmer;

  $: {
    buttonData = selectionGroup?.selectMode
      ? [
          {
            color: "Orange",
            title: "Rehash",
            icon: "refresh",
            keybinding: "h",
            disabled: selectionGroup.numSelected < 1,
            onClick: ifNotInModal(() => {
              modalContentArgs = {
                selectionGroup,
              };
              modalContentComponent = RehashStringsModal;
              usingBlur = true;
            }),
          },
          {
            color: "Red",
            title: "Delete",
            icon: "trash",
            keybinding: "d",
            disabled: selectionGroup.numSelected < 1,
            onClick: ifNotInModal(() => {
              modalContentArgs = {
                selectionGroup,
              };
              modalContentComponent = DeleteStringsModal;
              usingBlur = true;
            }),
          },
        ]
      : [
          {
            color: "Cyan",
            title: "Download",
            icon: "download",
            keybinding: "s",
            onClick: ifNotInModal(() => {
              if (Settings.rickGif) {
                window.location.href = constants.links.rickRoll;
              } else {
                modalContentArgs = {};
                modalContentComponent = StblDownloadModal;
                usingBlur = true;
              }
            }),
          },
          {
            color: "Purple",
            title: "Import Strings",
            icon: "upload",
            keybinding: "u",
            onClick: ifNotInModal(() => {
              alert("upload");
            }),
          },
          {
            color: "Green",
            title: "New String",
            icon: "plus",
            keybinding: "n",
            onClick: ifNotInModal(() => {
              modalContentArgs = {};
              modalContentComponent = NewStringModal;
              usingDimmer = true;
            }),
          },
        ];
  }

  function onModalClose() {
    usingBlur = false;
    usingDimmer = false;
    modalContentComponent = undefined;
    modalContentArgs = undefined;
  }
</script>

<FloatingActionButtonGroup {buttonData} />

{#if usingBlur}
  <BlurOverlay onClose={onModalClose}>
    <svelte:component
      this={modalContentComponent}
      onComplete={onModalClose}
      bind:project
      {...modalContentArgs}
    />
  </BlurOverlay>
{:else if usingDimmer}
  <DimmerOverlay onClose={onModalClose}>
    <svelte:component
      this={modalContentComponent}
      onComplete={onModalClose}
      bind:project
      {...modalContentArgs}
    />
  </DimmerOverlay>
{/if}

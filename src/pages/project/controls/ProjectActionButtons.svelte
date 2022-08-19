<script lang="ts">
  import type Project from "src/lib/models/project";
  import type SelectionGroup from "src/lib/models/selection-group";
  import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";
  import type { FloatingActionButtonData } from "src/components/controls/types";
  import FloatingActionButtonGroup from "src/components/controls/FloatingActionButtonGroup.svelte";
  import BlurOverlay from "src/components/layouts/BlurOverlay.svelte";

  export let selectionGroup: SelectionGroup<LocalizedStringEntry, number>;
  export let project: Project;

  const ifNotInModal = (fn: () => void) => {
    return () => {
      if (!inModal) fn();
    };
  };

  let usingBlurOverlay = false;
  let usingTransparentOverlay = false;
  let modalContentComponent: any;
  let modalContentArgs: object;
  let buttonData: FloatingActionButtonData[];

  $: inModal = usingBlurOverlay || usingTransparentOverlay;

  $: {
    buttonData = selectionGroup?.selectMode
      ? [
          {
            color: "Orange",
            title: "Rehash",
            icon: "refresh",
            keybinding: "r",
            onClick: ifNotInModal(() => {
              alert("rehash");
            }),
          },
          {
            color: "Red",
            title: "Delete",
            icon: "trash",
            keybinding: "d",
            onClick: ifNotInModal(() => {
              alert("delete");
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
              alert("download");
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
              alert("create");
            }),
          },
        ];
  }

  function onModalClose() {
    usingBlurOverlay = false;
    usingTransparentOverlay = false;
    modalContentComponent = undefined;
    modalContentArgs = undefined;
  }
</script>

<FloatingActionButtonGroup {buttonData} />

{#if usingBlurOverlay}
  <BlurOverlay onClose={onModalClose}>
    <svelte:component
      this={modalContentComponent}
      onComplete={onModalClose}
      bind:project
      {...modalContentArgs}
    />
  </BlurOverlay>
{:else if usingTransparentOverlay}
  <p>TODO:</p>
{/if}

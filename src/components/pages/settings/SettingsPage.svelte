<script lang="ts">
  import AccessibilityOptions from "../../shared/controls/AccessibilityOptions.svelte";
  import IconTextButton from "../../shared/elements/IconTextButton.svelte";
  import BlurOverlay from "../../shared/layout/BlurOverlay.svelte";
  import ContentArea from "../../shared/layout/ContentArea.svelte";
  import DeleteWorkspaceView from "./DeleteWorkspaceView.svelte";

  let clearingStorage = false;
</script>

<section id="settings-page">
  <ContentArea>
    <div>
      <AccessibilityOptions />
      <div class="mt-2">
        <IconTextButton
          icon="trash"
          text="Reset Workspace"
          danger={true}
          onClick={() => (clearingStorage = true)}
        />
      </div>
    </div>
  </ContentArea>
</section>

{#if clearingStorage}
  <BlurOverlay onClose={() => (clearingStorage = false)}>
    <DeleteWorkspaceView />
  </BlurOverlay>
{/if}

<style lang="scss">
  // intentionally blank
</style>

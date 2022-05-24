<script lang="ts">
  import { replace } from "svelte-spa-router";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import IconTextButton from "../../elements/IconTextButton.svelte";
  import BlurOverlay from "../../layout/BlurOverlay.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";

  let clearingStorage = false;

  function clearStorage() {
    localStorage.clear();
    replace("/");
    setTimeout(() => {
      location.reload();
    }, 200);
  }
</script>

<section id="settings-page">
  <ContentArea>
    <IconTextButton
      icon="trash"
      text="Clear Storage"
      onClick={() => (clearingStorage = true)}
    />
  </ContentArea>
</section>

{#if clearingStorage}
  <BlurOverlay onClose={() => (clearingStorage = false)}>
    <div slot="content">
      <GradientHeader title="Confirm Workspace Reset" />
      <p class="my-2">
        This will clear all of your storage. All of it. There will be nothing
        left, at all, and it cannot be recovered. Are you sure you want to
        continue?
      </p>
      <!-- TODO: replace with text box -->
      <IconTextButton
        icon="trash"
        text="Delete Everything Forever"
        onClick={clearStorage}
      />
    </div>
  </BlurOverlay>
{/if}

<style lang="scss">
  // intentionally blank
</style>

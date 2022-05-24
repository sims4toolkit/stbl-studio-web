<script lang="ts">
  import { replace } from "svelte-spa-router";
  import IconTextButton from "../../elements/IconTextButton.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
</script>

<section id="settings-page">
  <ContentArea>
    <p>hello</p>
    <IconTextButton
      icon="trash"
      text="Clear Storage"
      onClick={() => {
        localStorage.clear();
        replace("/");
        setTimeout(() => {
          location.reload();
        }, 200);
      }}
    />
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>

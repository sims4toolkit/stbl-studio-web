<script lang="ts">
  import { replace } from "svelte-spa-router";
  import AccessibilityOptions from "../../elements/AccessibilityOptions.svelte";
  import GradientHeader from "../../elements/GradientHeader.svelte";
  import IconTextButton from "../../elements/IconTextButton.svelte";
  import NavigationButton from "../../elements/NavigationButton.svelte";
  import TextInput from "../../elements/TextInput.svelte";
  import BlurOverlay from "../../layout/BlurOverlay.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";

  let clearingStorage = false;
  let clearingStorageConfirmationText = "";
  let clearingStorageConfirmed = false;

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
    <div slot="content">
      <GradientHeader title="Confirm Workspace Reset" />
      <p class="my-2">
        This will clear all of your data. All of it. Every last byte. There will
        be nothing left, at all, and it cannot be recovered. This action can not
        be undone. Are you sure you want to continue?
      </p>
      <TextInput
        label={'Type "Yes" to confirm'}
        placeholder="Yes"
        name="delete-everything-confirmation-input"
        fillWidth={true}
        bind:value={clearingStorageConfirmationText}
        bind:isValid={clearingStorageConfirmed}
        validators={[
          {
            error: 'Value must be "yes"',
            test(value) {
              return value.toLowerCase() === "yes";
            },
          },
        ]}
      />
      <div class="flex-center-v flex-end w-100 mt-2">
        <NavigationButton
          text="Delete Everything Forever"
          direction="right"
          active={clearingStorageConfirmed}
          onClick={clearStorage}
        />
      </div>
    </div>
  </BlurOverlay>
{/if}

<style lang="scss">
  // intentionally blank
</style>

<script lang="ts">
  import { replace } from "svelte-spa-router";
  import TextInput from "../../shared/elements/TextInput.svelte";
  import MultipageModalContent from "../../shared/layout/MultipageModalContent.svelte";

  let confirmationText = "";
  let confirmed = false;

  function clearStorage() {
    localStorage.clear();
    replace("/");
    setTimeout(() => {
      location.reload();
    }, 200);
  }
</script>

<MultipageModalContent
  title="Confirm Workspace Reset"
  completePages={confirmed ? 1 : 0}
  finalPageNextButtonText="Delete Everything Forever"
  onNextButtonClick={clearStorage}
>
  <div slot="content">
    <p class="mt-0 mb-2">
      This will clear all of your data. All of it. Every last byte. There will
      be nothing left, at all, and it cannot be recovered. Ever. Are you sure
      you want to continue?
    </p>
    <TextInput
      label={'Type "Yes" to confirm'}
      placeholder="Yes"
      name="delete-everything-confirmation-input"
      fillWidth={true}
      bind:value={confirmationText}
      bind:isValid={confirmed}
      focusOnMount={true}
      validators={[
        {
          error: 'Value must be "yes"',
          test(value) {
            return value.toLowerCase() === "yes";
          },
        },
      ]}
    />
  </div>
</MultipageModalContent>

<style lang="scss">
  // intentionally blank
</style>

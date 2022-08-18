<script lang="ts">
  import { replace } from "svelte-spa-router";
  import DatabaseService from "src/lib/services/database";
  import TextInput from "src/components/elements/TextInput.svelte";
  import MultipageContentGroup from "src/components/layouts/MultipageContentGroup.svelte";
  import MultipageContent from "src/components/layouts/MultipageContent.svelte";

  let confirmationText = "";

  let multipageState = {
    currentPage: 1,
    nextButtonEnabled: false,
  };

  function clearStorage() {
    localStorage.clear();
    DatabaseService.clear("metadata");
    DatabaseService.clear("stbls");

    replace("/");
    setTimeout(() => {
      location.reload();
    }, 200);
  }
</script>

<MultipageContentGroup
  title="Confirm Workspace Reset"
  numPages={1}
  bind:state={multipageState}
  completeButton="Delete Everything Forever"
  onLastPageComplete={clearStorage}
>
  <div slot="content" class="w-full">
    <MultipageContent pageNumber={1} bind:state={multipageState}>
      <div>
        <p class="mb-8">
          This will clear all of your data. All of it. Every last byte. There
          will be nothing left, at all, and it cannot be recovered. Ever. Are
          you sure you want to continue?
        </p>
        <TextInput
          label={'Type "Delete" to confirm'}
          placeholder="Delete"
          name="delete-everything-confirmation-input"
          fillWidth={true}
          bind:value={confirmationText}
          bind:isValid={multipageState.nextButtonEnabled}
          focusOnMount={true}
          validators={[
            {
              test(value) {
                return value.toLowerCase().trim() === "delete";
              },
              message: 'Value must be "Delete"',
            },
          ]}
        />
      </div>
    </MultipageContent>
  </div>
</MultipageContentGroup>

<script lang="ts">
  import HelpGeneralHtml from "./HelpGeneralHtml.svelte";
  import HelpQuestionAnswer from "./HelpQuestionAnswer.svelte";
  import HelpSwimLane from "./HelpSwimLane.svelte";

  export let data: HelpContentItem;

  $: component = (() => {
    switch (data.kind) {
      case "generalHtml":
        return HelpGeneralHtml;
      case "questionAnswer":
        return HelpQuestionAnswer;
      case "swimLane":
        return HelpSwimLane;
      default:
        return undefined;
    }
  })();
</script>

{#if data.kind === "hr"}
  <hr class="border-black dark:border-white hacker-border-gray" />
{:else if Boolean(component)}
  <svelte:component this={component} {data} />
{:else}
  <p>Oops... Something went wrong. Please report this.</p>
{/if}

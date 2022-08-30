<script lang="ts">
  export let data: HelpQuestionAnswerData;
</script>

<div class="w-full">
  {#if data.containsHtml}
    <h4 class="text-sm font-bold mb-2">{@html data.question}</h4>
    <p class="text-subtle text-sm">{@html data.answer}</p>
  {:else}
    <h4 class="text-sm font-bold mb-2">{data.question}</h4>
    <p class="text-subtle text-sm">{data.answer}</p>
  {/if}
</div>

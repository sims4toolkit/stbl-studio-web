<script lang="ts">
  import GradientHeader from "../../shared/elements/GradientHeader.svelte";
  import ContentArea from "../../shared/layout/ContentArea.svelte";
  import ToolView from "./ToolView.svelte";
</script>

<section id="tools-page">
  <ContentArea>
    <GradientHeader title="Miscellaneous Tools" />
    <div class="floating-card-group mt-2">
      <ToolView
        name="Pronoun Batch Fixer"
        description="The pronoun update changed how some text tokens work, and this online tool will help convert your strings to the new format."
        link="pronouns"
      />
    </div>
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>

<script lang="ts">
  import GradientHeader from "../../shared/elements/GradientHeader.svelte";
  import ContentArea from "../../shared/layout/ContentArea.svelte";
  import ToolView from "./ToolView.svelte";
</script>

<section id="tools-page">
  <ContentArea>
    <div class="mb-2">
      <GradientHeader title="Quick Tools" />
      <p>
        Tools that don't require projects to be used, and
        <strong class="error-color">do not autosave your data</strong>.
      </p>
    </div>
    <div class="floating-card-group mt-2">
      <ToolView
        name="Editor"
        description="View, search, and edit individual string tables of any size."
        link="editor"
      />
      <ToolView
        name="Hasher"
        description="Use the FNV algorithm to produce 32 and 64-bit hashes."
        link="hasher"
      />
      <ToolView
        name="Merger"
        description="Merge any number of string tables together, including different locales."
        link="merger"
      />
      <ToolView
        name="Pronoun Batch Fix"
        description="Convert all M/F pronouns to their new, gender-neutral tokens."
        link="pronouns"
      />
      <ToolView
        name="Translator"
        description="Translate a string table from one language to another."
        link="translator"
      />
    </div>
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>

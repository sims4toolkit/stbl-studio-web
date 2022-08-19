<script lang="ts">
  import type Project from "src/lib/models/project";

  export let project: Project;
  export let onComplete: () => void;
</script>

<p>{project.metaData.name}</p>
<button on:click={onComplete}>close</button>

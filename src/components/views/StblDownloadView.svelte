<script lang="ts">
  import type Project from "src/lib/models/project";
  import Select from "src/components/elements/Select.svelte";

  export let projects: Project[];

  let fileTypeIndex = 0;
  const fileTypeOptions = [
    {
      value: 0,
      text: "Package",
    },
    {
      value: 1,
      text: "String Table",
    },
    {
      value: 2,
      text: "JSON",
    },
  ];
</script>

<div class="flex flex-wrap sm:flex-nowrap">
  <Select
    label="download as"
    name="file-type-select"
    fillWidth={true}
    bind:selected={fileTypeIndex}
    options={fileTypeOptions}
  />
</div>

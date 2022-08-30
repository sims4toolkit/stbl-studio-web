<script lang="ts">
  import WindowManager from "src/lib/services/windows";

  export let data: HelpSwimLaneData;

  const goToLink = () =>
    WindowManager.request("help", "open", {
      route: data.link,
    });
</script>

<button
  class="w-full flex justify-between items-center gap-4"
  on:click={goToLink}
>
  <div class="text-left">
    <h4 class="text-sm font-bold mb-2">{data.title}</h4>
    <p class="text-subtle text-xs">{data.description}</p>
  </div>
  <img class="h-4 svg" src="./assets/chevron-right.svg" alt=">" />
</button>

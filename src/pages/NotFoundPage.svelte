<script>
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
</script>

<svelte:head>
  <title>Page Not Found</title>
</svelte:head>

<section class="flex-1 w-100 flex justify-center">
  <div class="w-full xl:max-w-screen-xl px-4 flex flex-col justify-center">
    <div class="mb-4">
      <SectionHeader title="Unlock this page for $4.04" />
    </div>
    <p class="mb-8">
      Just kidding. This page doesn't exist. Please <a
        href="/"
        class="text-secondary">go home</a
      >.
    </p>
    <p class="text-subtle text-xs">Error 404</p>
  </div>
</section>

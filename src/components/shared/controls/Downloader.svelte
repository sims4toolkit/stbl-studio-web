<script lang="ts">
  import { fly } from "svelte/transition";
  import { saveAs } from "file-saver";

  export let contentGenerator: () => Blob;
  export let onDownload: () => void;
  export let filename: string;

  let downloadError = false;

  async function contentGeneratorAsync(): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      try {
        const content = contentGenerator();
        resolve(content);
      } catch (err) {
        reject(err);
      }
    });
  }

  contentGeneratorAsync()
    .then((content) => {
      setTimeout(() => {
        saveAs(content, filename);
        onDownload();
      }, 500);
    })
    .catch((err) => {
      console.error(`Error downloading ${filename}:`, err);
      downloadError = true;
      setTimeout(onDownload, 2000);
    });
</script>

<div
  class="downloader drop-shadow"
  in:fly={{ y: 20, duration: 500 }}
  out:fly={{ y: 20, duration: 500 }}
>
  {#if downloadError}
    Oops, an error occurred.
  {:else}
    Downloading <span class="filename">{filename}</span>...
  {/if}
</div>

<style lang="scss">
  .downloader {
    z-index: 1024;
    position: fixed;
    bottom: 25px;
    left: 25px;
    background-color: var(--color-card);
    border-radius: 4px;
    padding: 8px;
    font-size: 0.8em;

    .filename {
      font-weight: bold;
    }
  }
</style>

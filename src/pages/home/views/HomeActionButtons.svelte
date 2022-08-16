<script lang="ts">
  import FloatingActionButtonGroup from "src/components/controls/FloatingActionButtonGroup.svelte";

  export let inModal: boolean;
  export let inSelectMode: boolean;
  export let numSelected: number;

  /*
    Save = "#305eba",
    Download = "#3f9bcc",
    Upload = "#6B5AC6",
    Create = "#48AD6F",
    Delete = "#D35454",
    Merge = "#BC47B7",
    Rehash = "#d17747",
  */

  $: buttonData = inSelectMode
    ? [
        {
          color: "#3F9BCC",
          title: "Download",
          icon: "download",
          onClick: () => {
            console.log("click");
          },
        },
        {
          color: "#BC47B7",
          title: "Merge",
          icon: "git-merge",
          onClick: () => {
            console.log("click");
          },
        },
        {
          color: "#D35454",
          title: "Delete",
          icon: "trash",
          onClick: () => {
            console.log("click");
          },
        },
      ]
    : [
        {
          color: "#305EBA",
          title: "Save Workspace",
          icon: "desktop-download",
          onClick: () => {
            console.log("click");
          },
        },
        {
          color: "#6B5AC6",
          title: "Upload Project",
          icon: "upload",
          onClick: () => {
            console.log("click");
          },
        },
        {
          color: "#48AD6F",
          title: "New Project",
          icon: "plus",
          onClick: () => {
            console.log("click");
          },
        },
      ];
</script>

<FloatingActionButtonGroup {buttonData} />

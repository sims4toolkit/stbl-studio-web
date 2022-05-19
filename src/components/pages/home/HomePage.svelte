<script lang="ts">
  import { StringTableLocale } from "@s4tk/models/enums";
  import type { StblProject } from "../../../global";
  import ToolbarColor from "../../../enums/toolbar-colors";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SplitView from "../../layout/SplitView.svelte";
  import FloatingActionButtonGroup from "../../shared/FloatingActionButtonGroup.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import SelectModeToggle from "../../shared/SelectModeToggle.svelte";
  import ProjectViewGroup from "../../views/ProjectViewGroup.svelte";

  let selectMode = false;
  let projects: StblProject[] = [
    {
      id: "__stbl0",
      name: "First STBL",
      group: "0",
      instance: "34567890ABCDEF",
      primaryLocale: StringTableLocale.English,
      stbls: [
        {
          locale: StringTableLocale.English,
          entries: [
            {
              key: "1234",
              value: "hi",
            },
            {
              key: "5678",
              value: "byte",
            },
          ],
        },
      ],
      toJson() {
        return "";
      },
    },
    {
      id: "__stbl1",
      name: "Second STBL",
      group: "0",
      instance: "34567890ABCDEF",
      primaryLocale: StringTableLocale.English,
      stbls: [
        {
          locale: StringTableLocale.English,
          entries: [
            {
              key: "1234",
              value: "hi",
            },
            {
              key: "5678",
              value: "byte",
            },
          ],
        },
      ],
      toJson() {
        return "";
      },
    },
  ]; // FIXME:

  const normalModeToolbar = [
    {
      title: "save workspace",
      icon: "desktop-download",
      color: ToolbarColor.Download,
      onClick() {
        console.log("Save Clicked");
      },
    },
    {
      title: "upload",
      icon: "upload",
      color: ToolbarColor.Upload,
      onClick() {
        console.log("Upload Clicked");
      },
    },
    {
      title: "create",
      icon: "plus",
      color: ToolbarColor.Create,
      onClick() {
        console.log("Create Clicked");
      },
    },
  ];

  const selectModeToolbar = [
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      onClick() {
        console.log("Delete Clicked");
      },
    },
    {
      title: "merge",
      icon: "git-merge",
      color: ToolbarColor.Merge,
      onClick() {
        console.log("Merge Clicked");
      },
    },
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      onClick() {
        console.log("Download Clicked");
      },
    },
  ];

  $: toolbarData = selectMode ? selectModeToolbar : normalModeToolbar;
</script>

<svelte:head>
  <title>STBL Studio</title>
</svelte:head>
<section id="home">
  <ContentArea banded={false}>
    <slot>
      <SplitView>
        <SectionHeader slot="left" title="My Workspace" />
        <SelectModeToggle
          slot="right"
          bind:selectMode
          bind:selectables={projects}
        />
      </SplitView>
      <ProjectViewGroup bind:projects bind:selectMode />
    </slot>
  </ContentArea>
</section>
<FloatingActionButtonGroup buttonData={toolbarData} />

<style lang="scss">
  #home {
    margin-top: 50px;
  }
</style>

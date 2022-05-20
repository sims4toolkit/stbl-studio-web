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
      name: "Stbl with a very long name that should be truncated",
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
            {
              key: "1357",
              value: "byte",
            },
            {
              key: "ABCD",
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
      primaryLocale: StringTableLocale.Italian,
      stbls: [
        {
          locale: StringTableLocale.Italian,
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

  // projects = []; // FIXME: temp
  projects.push(projects[0]);
  projects.push(projects[1]);
  projects.push(projects[0]);
  projects.push(projects[1]);

  $: workspaceEmpty = projects?.length === 0;

  $: toolbarDisabled = selectMode && !projects.some((p) => p.selected);

  const normalModeToolbar = [
    {
      title: "save workspace",
      icon: "desktop-download",
      color: ToolbarColor.Download,
      onClick() {
        alert("Save Clicked");
      },
    },
    {
      title: "upload",
      icon: "upload",
      color: ToolbarColor.Upload,
      onClick() {
        alert("Upload Clicked");
      },
    },
    {
      title: "create",
      icon: "plus",
      color: ToolbarColor.Create,
      onClick() {
        alert("Create Clicked");
      },
    },
  ];

  const selectModeToolbar = [
    {
      title: "delete",
      icon: "trash",
      color: ToolbarColor.Delete,
      onClick() {
        alert("Delete Clicked");
      },
    },
    {
      title: "merge",
      icon: "git-merge",
      color: ToolbarColor.Merge,
      onClick() {
        alert("Merge Clicked");
      },
    },
    {
      title: "download",
      icon: "download",
      color: ToolbarColor.Download,
      onClick() {
        alert("Download Clicked");
      },
    },
  ];

  $: toolbarData = selectMode ? selectModeToolbar : normalModeToolbar;
</script>

<svelte:head>
  <title>STBL Studio</title>
</svelte:head>
<section id="home-section" class:center-v={workspaceEmpty}>
  {#if workspaceEmpty}
    <ContentArea>
      <slot>
        <div class="empty-workspace">
          <h1>Your workspace is empty.</h1>
          <p>
            Upload existing string tables or create new ones with the toolbar in
            the bottom-right corner.
          </p>
          <p>
            Confused? Read <a href="#/help">the help page</a> to learn how to use
            String Table Studio.
          </p>
        </div>
      </slot>
    </ContentArea>
  {:else}
    <ContentArea>
      <slot>
        <div class="mb-2">
          <SplitView>
            <SectionHeader slot="left" title="My Workspace" />
            <SelectModeToggle
              slot="right"
              bind:selectMode
              bind:selectables={projects}
            />
          </SplitView>
        </div>
        <ProjectViewGroup bind:projects bind:selectMode />
      </slot>
    </ContentArea>
  {/if}
</section>
<FloatingActionButtonGroup
  buttonData={toolbarData}
  disabled={toolbarDisabled}
  disabledText="nothing selected"
/>

<style lang="scss">
  #home-section {
    padding-top: 50px;
    min-height: 100vh;

    &.center-v {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .empty-workspace {
      h1 {
        opacity: 0.65;
        margin: {
          top: 0;
          bottom: 2em;
        }
      }
    }
  }
</style>

<script lang="ts">
  import Project from "../../../models/project";
  import ToolbarColor from "../../../enums/toolbar-colors";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SplitView from "../../layout/SplitView.svelte";
  import FloatingActionButtonGroup from "../../shared/FloatingActionButtonGroup.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import SelectModeToggle from "../../shared/SelectModeToggle.svelte";
  import ProjectViewGroup from "../../views/ProjectViewGroup.svelte";
  import SelectionGroup from "../../../models/selection-group";

  const { StringTableLocale } = window.S4TK.enums; // FIXME: get rid of this
  const { StringTableResource } = window.S4TK.models; // FIXME: get rid of this

  let projects: Project[] = [];

  let selectionGroup: SelectionGroup<Project>;
  selectionGroup = new SelectionGroup(projects, "uuid", () => {
    // needed for svelte reactivity
    selectionGroup = selectionGroup;
  });

  // FIXME: get rid of this
  projects.push(
    new Project({
      group: 0,
      instanceBase: 12345n,
      name: "Test Project",
      primaryLocale: StringTableLocale.English,
      uuid: "0",
      stbls: [
        {
          locale: StringTableLocale.English,
          stbl: new StringTableResource([
            {
              key: 1234,
              value: "hi",
            },
            {
              key: 5678,
              value: "bye",
            },
            {
              key: 2468,
              value: "untranslated",
            },
          ]),
        },
        {
          locale: StringTableLocale.Italian,
          stbl: new StringTableResource([
            {
              key: 1234,
              value: "ciao",
            },
            {
              key: 5678,
              value: "arrivederci",
            },
          ]),
        },
      ],
    })
  );

  $: workspaceEmpty = projects?.length === 0;
  $: toolbarDisabled = selectionGroup.noneSelected;

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

  $: toolbarData = selectionGroup.selectMode
    ? selectModeToolbar
    : normalModeToolbar;
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
            <SelectModeToggle slot="right" bind:selectionGroup />
          </SplitView>
        </div>
        <ProjectViewGroup bind:selectionGroup />
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

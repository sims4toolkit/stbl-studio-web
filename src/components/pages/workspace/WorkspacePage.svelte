<script lang="ts">
  import { onDestroy } from "svelte";
  import BlurOverlay from "../../layout/BlurOverlay.svelte";
  import Workspace from "../../../lib/models/workspace";
  import Settings from "../../../lib/services/settings";
  import { activeWorkspace } from "../../../lib/services/stores";
  import OnboardingView from "./OnboardingView.svelte";

  let workspace: Workspace;
  let onboarding = false;
  let restoreError = false;

  $: workspaceEmpty = Boolean(!workspace?.projects.length);

  //#region Lifecycle

  if (!Settings.hasWorkspace) {
    Workspace.fromStorage()
      .then((w) => {
        activeWorkspace.set(w);
      })
      .catch((err) => {
        restoreError = true;
        console.error(err);
      });
  } else {
    onboarding = true;
  }

  const subscriptions = [
    activeWorkspace.subscribe((w) => {
      workspace = w;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  //#endregion Lifecycle
</script>

<section class:flex-center-v={workspaceEmpty}>
  <p>hi</p>
</section>

{#if restoreError}
  <BlurOverlay>
    <div>
      <h2>Well, this is awkward...</h2>
      <p>
        An error occurred and your workspace could not be restored. Do not worry
        - your data is most likely safe, and this is just an error on the front
        end. Please reach out to Frank either
        <a href="https://discord.gg/qNhD3Jh" target="_blank">on Discord</a> or
        by opening an issue
        <a
          href="https://github.com/sims4toolkit/stbl-studio-web/issues"
          target="_blank">on GitHub</a
        >, and he can help you get your projects back.
      </p>
      <p>If you're more tech-savvy, you can try the following:</p>
      <ol>
        <li>Open your browser's developer tools.</li>
        <li>Check Local Storage (under "Application").</li>
        <li>Look for long, Base64-encoded strings. These are your STBLs.</li>
      </ol>
    </div>
  </BlurOverlay>
{:else if onboarding}
  <BlurOverlay>
    <OnboardingView exitOnboarding={() => (onboarding = false)} />
  </BlurOverlay>
{/if}

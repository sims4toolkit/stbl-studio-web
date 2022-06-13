<script lang="ts">
  import { getLocaleData } from "../../../typescript/helpers/localization";
  import type Project from "../../../typescript/models/project";

  export let project: Project;

  $: localeCode = getLocaleData(project.primaryLocale).code;
</script>

<div class="stbl-features w-100">
  <div class="stbl-feature">
    <p class="small-title">source</p>
    <p>{localeCode}</p>
  </div>
  <div class="stbl-feature">
    <p class="small-title">locales</p>
    <p>{project.numLocales}</p>
  </div>
  <div class="stbl-feature">
    <p class="small-title">strings</p>
    <p>{project.numStrings}</p>
  </div>
</div>

<style lang="scss">
  .stbl-features {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 1em;

    .stbl-feature {
      flex: 1 1 0px;
      border: 1px solid var(--color-divider);
      border-radius: 4px;
      text-align: center;
      padding: {
        top: 6px;
        bottom: 6px;
        left: 12px;
        right: 12px;
      }

      p {
        margin: 0;
      }
    }
  }
</style>

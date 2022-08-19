import App from "src/App.svelte";
import Settings from "src/lib/services/settings";
import DocumentUtils from "src/lib/utilities/document";

const app = new App({
	target: document.body,
});

window.addEventListener("load", () => {
	DocumentUtils.toggleLightTheme(Settings.isLightTheme, false);
	DocumentUtils.toggleBooleanAttribute("data-hacker-theme", Settings.mainframeHacked);
	DocumentUtils.toggleBooleanAttribute("data-monochrome-toolbar", Settings.disableToolbarColors);
	DocumentUtils.toggleBooleanAttribute("data-allow-blur", !Settings.disableBlur);
});

export default app;

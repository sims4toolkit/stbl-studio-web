import App from "src/App.svelte";
import Settings from "src/lib/services/settings";
import DocumentUtils from "src/lib/utilities/document";

const app = new App({
	target: document.body,
});

window.addEventListener("load", () => {
	DocumentUtils.toggleBlurEffect(Settings.disableBlur);
	DocumentUtils.toggleLightTheme(Settings.isLightTheme, false);
});

export default app;

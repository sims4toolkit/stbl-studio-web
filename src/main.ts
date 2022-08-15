import App from "src/App.svelte";
import Settings from "src/lib/services/settings";

const app = new App({
	target: document.body,
});

window.addEventListener("load", () => {
	// just to update the UI as soon as ready
	Settings.isLightTheme = Settings.isLightTheme;
	Settings.disableBlur = Settings.disableBlur;
});

export default app;

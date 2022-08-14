export function toggleLightTheme(isLightTheme: boolean) {
  document.documentElement.setAttribute(
    "data-theme",
    isLightTheme ? "light" : "dark"
  );
}

export function toggleBlurEffect(blurDisabled: boolean) {
  document.documentElement.setAttribute(
    "data-allow-blur",
    blurDisabled ? "false" : "true"
  );
}

namespace DocumentUtils {
  export function toggleLightTheme(isLightTheme: boolean, smooth: boolean) {
    if (smooth) {
      document.documentElement.classList.add("theme-transition");
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 500); // keep in sync with theme-transition class in base.scss
    }

    if (isLightTheme) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }

  export function toggleBlurEffect(blurDisabled: boolean) {
    document.documentElement.setAttribute(
      "data-allow-blur",
      blurDisabled ? "false" : "true"
    );
  }

  // FIXME: use setting and pass in
  export function toggleHackerTheme() {
    document.documentElement.setAttribute(
      "data-hacker-theme",
      "true"
    );
  }
}

export default DocumentUtils;

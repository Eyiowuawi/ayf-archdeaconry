export type ThemeChoice = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "ayf-theme";

/**
 * Runs in <head> before the page paints, so a saved light/dark choice applies
 * without a flash. "system" (or nothing saved) leaves the device setting in charge.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

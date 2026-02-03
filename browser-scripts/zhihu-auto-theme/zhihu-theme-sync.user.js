// ==UserScript==
// @name         Zhihu Auto Theme Sync
// @name:zh-CN   知乎自动跟随系统主题
// @namespace    https://github.com/Linsama/toolbox
// @version      1.0.0
// @description  Automatically toggle Zhihu's light/dark mode based on system color scheme.
// @description:zh-CN 自动根据系统偏好（深色/浅色模式）切换知乎网页版主题。
// @author       Linsama
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @supportURL   https://github.com/Linsama/toolbox/issues
// @updateURL    https://raw.githubusercontent.com/Linsama/toolbox/main/browser-scripts/zhihu-auto-theme/zhihu-theme-sync.user.js
// @downloadURL  https://raw.githubusercontent.com/Linsama/toolbox/main/browser-scripts/zhihu-auto-theme/zhihu-theme-sync.user.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Staff Engineer Note:
     * We use document-start to minimize FOUC (Flash of Unstyled Content).
     * The redirection is handled via URL parameters which Zhihu uses to set its theme cookies.
     */
    function syncTheme() {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const targetTheme = isSystemDark ? 'dark' : 'light';

        const url = new URL(window.location.href);
        const currentThemeParam = url.searchParams.get('theme');

        // Prevent infinite redirect loops
        if (currentThemeParam === targetTheme) return;

        // Double check the actual rendered theme to avoid unnecessary reloads
        const currentActualTheme = document.documentElement.getAttribute('data-theme');
        if (currentActualTheme === targetTheme) return;

        // Apply theme via URL parameter
        url.searchParams.set('theme', targetTheme);

        // Use replace() to keep browser history clean
        window.location.replace(url.toString());
    }

    // Initial check
    syncTheme();

    // Listen for system theme changes in real-time
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    try {
        matcher.addEventListener('change', syncTheme);
    } catch (e) {
        // Fallback for older browser engines
        matcher.addListener(syncTheme);
    }
})();
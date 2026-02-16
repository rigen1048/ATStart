chrome.runtime.onStartup.addListener(() => {
  const urls = ["http://localhost:3000/login", "https://www.youtube.com"]; //------------- ADD LINK HERE

  if (urls.length === 0) return;

  // Focus on the last-focused window (the one that just started)
  chrome.tabs.query({ lastFocusedWindow: true }, (tabs) => {
    const isNewTabPage = (tab) =>
      tab.url === "chrome://newtab/" ||
      tab.pendingUrl === "chrome://newtab/" ||
      tab.url === "about:newtab" || // Firefox uses about:newtab
      !tab.url;

    if (tabs.length === 1 && isNewTabPage(tabs[0])) {
      // Fresh start: hijack the single blank tab
      const firstUrl = urls[0];
      const remainingUrls = urls.slice(1);

      // Update the existing tab to the first URL (keeps it active)
      chrome.tabs.update(tabs[0].id, { url: firstUrl });

      // Open the rest to the right, inactive (focus stays on first)
      let nextIndex = tabs[0].index + 1;
      remainingUrls.forEach((url) => {
        chrome.tabs.create({ url, index: nextIndex++, active: false });
      });
    } else {
      // Session restore or custom pages: just add all tabs (no hijacking)
      urls.forEach((url) => {
        chrome.tabs.create({ url });
      });
    }
  });
});

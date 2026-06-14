"use strict";

const CONTENT_SCRIPT_PATH = "content-script.js";
const PANEL_PATH = "panel/panel.html";
const PANEL_URL = browser.runtime.getURL(PANEL_PATH);
const PAGE_READ_GRANT_TTL_MS = 5 * 60 * 1000;
const SUPPORTED_PAGE_PROTOCOLS = new Set(["http:", "https:", "file:"]);

let pageReadGrant = null;

function isSupportedTab(tab) {
  if (!tab || typeof tab.id !== "number" || !tab.url) {
    return false;
  }

  try {
    return SUPPORTED_PAGE_PROTOCOLS.has(new URL(tab.url).protocol);
  } catch (_error) {
    return false;
  }
}

function rememberPageReadGrant(tab) {
  if (!isSupportedTab(tab)) {
    pageReadGrant = null;
    return;
  }

  pageReadGrant = {
    tabId: tab.id,
    windowId: tab.windowId,
    url: tab.url,
    expiresAt: Date.now() + PAGE_READ_GRANT_TTL_MS
  };
}

function getPageReadGrantError(tab) {
  if (!pageReadGrant) {
    return "Open the sidebar from the toolbar before reading this page.";
  }

  if (Date.now() > pageReadGrant.expiresAt) {
    pageReadGrant = null;
    return "Page access expired. Open the sidebar from the toolbar again.";
  }

  if (
    tab.id !== pageReadGrant.tabId ||
    tab.windowId !== pageReadGrant.windowId ||
    tab.url !== pageReadGrant.url
  ) {
    return "Open the sidebar from the toolbar again for the active page.";
  }

  return "";
}

async function ensureContentScript(tabId) {
  try {
    await browser.tabs.sendMessage(tabId, { type: "HELLO_PANEL_PING" });
    return;
  } catch (_error) {
    await browser.tabs.executeScript(tabId, { file: CONTENT_SCRIPT_PATH });
  }
}

function isTrustedPanelSender(sender) {
  if (!sender || sender.id !== browser.runtime.id || sender.tab || !sender.url) {
    return false;
  }

  try {
    const expectedUrl = new URL(PANEL_URL);
    const actualUrl = new URL(sender.url);

    return (
      actualUrl.origin === expectedUrl.origin &&
      actualUrl.pathname === expectedUrl.pathname
    );
  } catch (_error) {
    return false;
  }
}

function limitString(value, maxLength) {
  return String(value || "").slice(0, maxLength);
}

function normalizePageSnapshot(snapshot) {
  if (!snapshot || snapshot.ok !== true) {
    return { ok: false, error: "Unable to read the active page." };
  }

  return {
    ok: true,
    page: {
      url: limitString(snapshot.url, 2048),
      title: limitString(snapshot.title, 240),
      selectedText: limitString(snapshot.selectedText, 1000),
      textSample: limitString(snapshot.textSample, 5000)
    }
  };
}

async function openSidebar(tab) {
  rememberPageReadGrant(tab);
  await browser.sidebarAction.open();
}

async function getActivePageSnapshot() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  if (!isSupportedTab(tab)) {
    return { ok: false, error: "This page cannot be read by the extension." };
  }

  const grantError = getPageReadGrantError(tab);

  if (grantError) {
    return { ok: false, error: grantError };
  }

  await ensureContentScript(tab.id);

  const snapshot = await browser.tabs.sendMessage(tab.id, {
    type: "HELLO_PANEL_READ_PAGE"
  });

  return normalizePageSnapshot(snapshot);
}

browser.browserAction.onClicked.addListener((tab) => {
  openSidebar(tab).catch((error) => {
    console.error("Unable to open Hello World sidebar", error);
  });
});

browser.runtime.onMessage.addListener((message, sender) => {
  if (!message || message.type !== "HELLO_PANEL_GET_PAGE_SNAPSHOT") {
    return undefined;
  }

  if (!isTrustedPanelSender(sender)) {
    return undefined;
  }

  return getActivePageSnapshot();
});

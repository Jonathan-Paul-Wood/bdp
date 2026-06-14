"use strict";

(() => {
  const STATE_KEY = "__helloWorldPageReader";
  const MAX_TEXT_SAMPLE_LENGTH = 5000;

  if (globalThis[STATE_KEY]) {
    return;
  }

  function isTrustedExtensionSender(sender) {
    return Boolean(sender && sender.id === browser.runtime.id);
  }

  function readPageSnapshot() {
    const bodyText = document.body ? document.body.innerText.trim() : "";
    const selectedText = String(globalThis.getSelection ? globalThis.getSelection() : "").trim();

    return {
      ok: true,
      url: globalThis.location.href,
      title: document.title,
      selectedText,
      textSample: bodyText.slice(0, MAX_TEXT_SAMPLE_LENGTH)
    };
  }

  browser.runtime.onMessage.addListener((message, sender) => {
    if (!message || typeof message.type !== "string") {
      return undefined;
    }

    if (!isTrustedExtensionSender(sender)) {
      return undefined;
    }

    if (message.type === "HELLO_PANEL_PING") {
      return Promise.resolve({ ok: true });
    }

    if (message.type === "HELLO_PANEL_READ_PAGE") {
      return Promise.resolve(readPageSnapshot());
    }

    return undefined;
  });

  globalThis[STATE_KEY] = {
    readPageSnapshot
  };
})();

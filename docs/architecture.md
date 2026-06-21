
## Load in Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on...`.
3. Select `manifest.json` from this folder.
4. Visit an `http`, `https`, or `file` page and click the Hello World toolbar button.

Temporary add-ons are removed when Firefox restarts. Package and sign the extension when you are ready to install it permanently.

## Security Model

The extension keeps plugin UI/data separate from the current webpage:

- `manifest.json` uses Firefox's native `sidebar_action` instead of injecting extension UI into page DOM.
- `panel/panel.html` is an extension page. It owns the input, heading, and `browser.storage.local` access.
- `content-script.js` does not mount UI and does not read or write extension storage. It only answers narrow page snapshot requests from this extension.
- `background.js` opens the sidebar from the toolbar button and records a five-minute page-read grant for that active tab and URL.
- `background.js` only accepts `HELLO_PANEL_GET_PAGE_SNAPSHOT` from the sidebar panel URL for this extension.
- User-submitted text is rendered with `textContent`, not `innerHTML`, so submitted markup is displayed as text rather than executed.

The panel files are not listed in `web_accessible_resources`, so ordinary webpages cannot load the sidebar UI as web content. Future page-reading features should continue to pass through the background script instead of exposing storage or panel state to content scripts.

## Future Page Reading

`background.js` includes a gated `HELLO_PANEL_GET_PAGE_SNAPSHOT` route. The sidebar can call it after the user opens the sidebar from the toolbar:

```js
const snapshot = await browser.runtime.sendMessage({
  type: "HELLO_PANEL_GET_PAGE_SNAPSHOT"
});
```

That returns a narrow object with the active page URL, title, selected text, and a capped text sample from the injected content script.

## Validate

Install development dependencies once:

```powershell
npm install
```

Run the local scaffold check:

```powershell
npm run check
```

Run ESLint, including `eslint-plugin-no-unsanitized`:

```powershell
npm run lint
```

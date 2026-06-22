# Bias Detection Panel

BDP is a small Firefox WebExtension to help you pick out opinionated language and other forms of bias in the content you read.

# License

This tool is available under a <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en" target="_blank">CC-BY-NC-SA 4.0</a> license. You may use, distribute, and modify this software solong as you credit the original, do not monetise it, and all derivatives share this license.

## Contribution

### Setup

Clone this repository

```powershell
git clone https://github.com/Jonathan-Paul-Wood/bdp.git
```

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

### Local Development

1. Open `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on...`.
3. Select `manifest.json` from this folder.
4. Visit an `http`, `https`, or `file` page and click the BDP toolbar button.

Temporary add-ons are removed when Firefox restarts.
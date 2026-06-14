"use strict";

const STORAGE_KEY = "helloPanelHeading";
const DEFAULT_HEADING = "hello world";

const heading = document.getElementById("heading");
const form = document.getElementById("hello-form");
const input = document.getElementById("hello-input");

function normalizeHeading(value) {
  const trimmed = String(value || "").trim();
  return trimmed || DEFAULT_HEADING;
}

function setHeading(value) {
  heading.textContent = normalizeHeading(value);
}

async function restoreHeading() {
  const stored = await browser.storage.local.get({ [STORAGE_KEY]: DEFAULT_HEADING });
  setHeading(stored[STORAGE_KEY]);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nextHeading = normalizeHeading(input.value);
  await browser.storage.local.set({ [STORAGE_KEY]: nextHeading });
  setHeading(nextHeading);
  input.value = "";
  input.focus();
});

restoreHeading().catch((error) => {
  console.error("Unable to restore Hello World heading", error);
  setHeading(DEFAULT_HEADING);
});

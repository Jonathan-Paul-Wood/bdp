"use strict";

const STORAGE_KEY = "BDP_HEADING";
const DEFAULT_HEADING = "hello world";

var pageDataExtractUrl = '';
var pageDataExtractContent = 'No data yet';

const heading = document.getElementById("heading");
const form = document.getElementById("hello-form");
const input = document.getElementById("hello-input");

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "bdp_extract") {
    console.log('bdp_extract message received');
    resetBiasResults();

    pageDataExtractUrl = message.url;
    pageDataExtractContent = message.article.trim();

    const analyzeButton = document.getElementById("analyze-page");
    if (pageDataExtractContent && pageDataExtractContent.length !== 'No data yet') {
      analyzeButton.disabled = false;
      analyzeButton.tooltip = "Click to analyze the page for bias";
    } else {
      analyzeButton.disabled = true;
      analyzeButton.tooltip = "No data found to analyze. Perhaps this page has no article? If you think this is a mistake please open an Issue on the GitHub.";
    }
  }
})

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


const tabs = document.getElementsByClassName('tablinks');

for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener('click', () => {
    console.log(tabs[i])
    const focusTab = tabs[i].attributes.value.value;
    console.log(focusTab)

    const tabContent = document.getElementsByClassName("tabcontent");
    for(let j = 0; j < tabContent.length; j++) {
      tabContent[j].style.display = "none"; // hide all tabs
    }

    const tabSelections = document.getElementsByClassName('tablinks');
    for(let j = 0; j < tabSelections.length; j++) {
      tabSelections[j].className = tabSelections[j].className.replace(" active", ""); // deactivate all tabs
    }

    document.getElementById(focusTab).style.display = "block"; // show current tab
    tabs[i].className += " active"; // mark current tab as active
  })
}
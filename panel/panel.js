"use strict";

const STORAGE_KEY = "helloPanelHeading";
const DEFAULT_HEADING = "hello world";

let pageDataExtractUrl = '';
let pageDataExtractContent = 'No data yet';

const heading = document.getElementById("heading");
const form = document.getElementById("hello-form");
const input = document.getElementById("hello-input");
const preview = document.getElementById("extract-preview");
const previewURL = document.getElementById("extract-url")

browser.runtime.onMessage.addListener((message, sender) => {
  preview.textContent = String(message.type);
  if (message.type === "bdp_extract") {

    pageDataExtractUrl = message.url;
    pageDataExtractContent = message.article.trim();

    preview.textContent = String(message.article.trim() || 'No extract availabel.').slice(0,200);
    if (message.article.trim().length > 200) preview.textContent += '...';
    previewURL.textContent = String(message.url || 'Error, no URL found');

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

function openTab(evt, tabName) {
  alert('hi')

  // Get all elements with class="tabcontent" and hide them
  const tabContent = document.getElementsByClassName("tabcontent");
  tabContent.forEach((tab) => {
    tab.style.display = "none";
  })

  // Get all elements with class="tablinks" and remove the class "active"
  const tabLinks = document.getElementsByClassName("tablinks");
  tabLinks.forEach((link) => {
    link.className = link.className.replace(" active", "");
  })

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
} 

function scrapeCurrentPage() {
  alert('help')
  setHeading(DEFAULT_HEADING);
}
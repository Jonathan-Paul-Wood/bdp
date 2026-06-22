const url = window.location.toString().split('?')[0];
let article = document.getElementsByTagName('article')[0]?.outerHTML || null;

if (!article) {
    article = document.body.textContent.replace('/[\n\t]{2,}/g', '\n')
}

browser.runtime.sendMessage({
    type: 'bdp_extract',
    url: url,
    article: article
})
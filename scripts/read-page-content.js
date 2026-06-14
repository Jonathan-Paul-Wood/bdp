console.log('extension running...')
const url = window.location.toString().split('?')[0];
console.log('url: ', url)
const article = document.body.textContent.replace('/[\n\t]{2,}/g', '\n')
console.log('article!!!: ', article);

localStorage.setItem('BDP_current_url_temp', url );
localStorage.setItem('BDP_current_article_temp', article);
console.log('done!!! goodbye')
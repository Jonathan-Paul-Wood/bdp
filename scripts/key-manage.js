var apiKey = ""; // global, shared across scripts

document.getElementById("apiKey").addEventListener('change', (event) => {
    apiKey = event.target.value;
})
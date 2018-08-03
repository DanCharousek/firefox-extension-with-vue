const btn = document.querySelector('#button');
      btn.addEventListener('click', loadTabs);

function loadTabs() {
// This is the request to obtain an array of active tabs. It returns a promise.
// It accepts a config object (see docs)
browser.tabs.query({ currentWindow: true })
    .then(tabs => {
        const results = document.querySelector('#results');
        results.innerHTML = '';
        for (let tab of tabs) {
            results.innerHTML += `<li>${tab.title}</li>`;
        }
    });
}
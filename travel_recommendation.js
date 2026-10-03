const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const resultsContainer = document.getElementById('resultsContainer');

let travelData = null;

// JSON verisini çek
fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
  })
  .catch(error => console.error('Error loading data:', error));

function displayResults(items) {
  resultsContainer.innerHTML = '';
  if (!items || items.length === 0) {
    resultsContainer.innerHTML = '<div class="card"><p>No results found. Try searching for "beach", "temple", or "country".</p></div>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="result-info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="visit-btn">Visit</button>
      </div>
    `;
    resultsContainer.appendChild(card);
  });
}

function handleSearch() {
  if (!travelData) return;
  const keyword = searchInput.value.trim().toLowerCase();
  let results = [];

  if (keyword.includes('beach')) {
    results = travelData.beaches;
  } else if (keyword.includes('temple')) {
    results = travelData.temples;
  } else if (keyword.includes('country') || keyword.includes('australia') || keyword.includes('japan')) {
    travelData.countries.forEach(country => {
      if (keyword.includes('country') || country.name.toLowerCase().includes(keyword)) {
        results.push(...country.cities);
      }
    });
  } else {
    // Eşleşen şehir ya da ülke kontrolü
    travelData.countries.forEach(country => {
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(keyword)) {
          results.push(city);
        }
      });
    });
  }

  displayResults(results);
}

function handleClear() {
  searchInput.value = '';
  resultsContainer.innerHTML = '';
}

btnSearch.addEventListener('click', handleSearch);
btnClear.addEventListener('click', handleClear);

// Enter tuşuna basınca arama tetikleme
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
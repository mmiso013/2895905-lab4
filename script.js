// DOM Elements
const searchInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const countryInfo = document.getElementById('country-info');
const bordersContainer = document.getElementById('borders');
const spinner = document.querySelector('.spinner');

// ===============================
// Main Search Function (Required)
// ===============================
async function searchCountry(countryName) {
    try {
        if (!countryName.trim()) {
            throw new Error('Please enter a country name.');
        }

        // Show loading spinner
        spinner.style.display = 'block';
        countryInfo.innerHTML = '';
        bordersContainer.innerHTML = '';

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error('Country not found. Please try again.');
        }

        const data = await response.json();
        const country = data[0];

        // ===============================
        // Update Main Country Info (DOM Pattern)
        // ===============================
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        // ===============================
        // Fetch Bordering Countries
        // ===============================
        if (country.borders && country.borders.length > 0) {
            bordersContainer.innerHTML = `<h3>Bordering Countries:</h3>`;

            for (const code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderCard = document.createElement('div');
                borderCard.classList.add('border-country');

                borderCard.innerHTML = `
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="50">
                    <p>${borderCountry.name.common}</p>
                `;

                bordersContainer.appendChild(borderCard);
            }
        } else {
            bordersContainer.innerHTML = `<p>No bordering countries.</p>`;
        }

    } catch (error) {
        // Show user-friendly error message
        countryInfo.innerHTML = `<p class="error">⚠️ ${error.message}</p>`;
        bordersContainer.innerHTML = '';
    } finally {
        // Hide loading spinner
        spinner.style.display = 'none';
    }
}

// ===============================
// Event Listeners (Required)
// ===============================

// Button click
searchBtn.addEventListener('click', () => {
    const country = searchInput.value;
    searchCountry(country);
});

// Press Enter
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchCountry(searchInput.value);
    }
});
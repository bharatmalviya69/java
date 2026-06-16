// OpenWeatherMap Configuration
const API_KEY = 'e5714680b4690c6ab4d3e7baabed8942'; // Replace with your actual OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Element Selections
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const errorCard = document.getElementById('error-message');

const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Primary Search Handler
function handleSearch() {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
    } else {
        showError('Please enter a valid city name.');
    }
}

/**
 * Key Feature: Fetch real-time data using modern Fetch API and async/await
 * Key Feature: Implement comprehensive error handling for failed network requests
 */
async function getWeatherData(city) {
    // Reset layout states before processing new request
    hideDataLayouts();

    try {
        const targetUrl = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
        const response = await fetch(targetUrl);

        // Catch specific standard HTTP responses (e.g., 404 Not Found)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please double-check the spelling.');
            } else if (response.status === 401) {
                throw new Error('Invalid API Key. Please verify your API setup.');
            } else {
                throw new Error(`Server returned status: ${response.status}`);
            }
        }

        const data = await response.json();
        
        // Key Feature: Parse and dynamically render complex nested JSON objects
        renderWeatherData(data);

    } catch (error) {
        // Fallback catch block handles blockages, lack of internet connection, and thrown errors
        showError(error.message || 'A network error occurred. Please try again.');
    }
}

/**
 * Parses and maps nested fields from JSON response structure to UI
 * Example Nested JSON Fields Checked: data.main.temp, data.weather[0].description
 */
function renderWeatherData(data) {
    locationName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;

    // Unhide presentation view
    weatherCard.classList.remove('hidden');
}

// Error Rendering Helper
function showError(message) {
    errorCard.textContent = message;
    errorCard.classList.remove('hidden');
}

// Utility cleanup to toggle views
function hideDataLayouts() {
    errorCard.classList.add('hidden');
    weatherCard.classList.add('hidden');
}
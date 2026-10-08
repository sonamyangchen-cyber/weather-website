async function getWeather() {

    const city = document.getElementById("cityInput").value;

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        // Step 1: Find the city
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            alert("City not found. Please try again.");
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // Step 2: Get current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        // Step 3: Display city name
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;


        // Step 4: Display temperature
        document.getElementById("temperature").textContent =
            `${current.temperature_2m} °C`;


        // Step 5: Display humidity
        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m} %`;


        // Step 6: Display wind speed
        document.getElementById("windSpeed").textContent =
            `${current.wind_speed_10m} km/h`;


        // Step 7: Display weather condition
        const weatherInfo = getWeatherDescription(current.weather_code);

        document.getElementById("description").textContent =
            weatherInfo.description;

        document.getElementById("weatherIcon").textContent =
            weatherInfo.icon;

    } 
    
    catch (error) {

        console.error(error);

        alert("Unable to get weather data. Please try again.");

    }
}


// Convert weather code into description and icon

function getWeatherDescription(code) {

    if (code === 0) {
        return {
            description: "Clear sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            description: "Partly cloudy",
            icon: "⛅"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast",
            icon: "☁️"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            description: "Foggy",
            icon: "🌫️"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            description: "Rain",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            description: "Snow",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            description: "Rain showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        description: "Unknown weather",
        icon: "🌤️"
    };
}
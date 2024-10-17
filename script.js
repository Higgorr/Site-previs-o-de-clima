function getWeather() {
    const apiKey = '46313f6ccbe89f67ef2f8f4bfa2134fa';
    const cidade = document.getElementById('cidade').value;

    if (!cidade) {
        alert('Please enter a cidade');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&lang=pt`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados meteorológicos atuais.', error);
            alert('Erro ao buscar dados meteorológicos atuais. Por favor, tente novamente.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Erro ao buscar dados de previsão por hora:', error);
            alert('Erro ao buscar dados de previsão por hora. Por favor, tente novamente.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Converte pra Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Exibir as próximas 24 horas (intervalos de 3 horas)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert hora pra millisegundos
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Converte pra Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Torna a imagem visível depois de carregada
}
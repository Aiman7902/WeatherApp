const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const notFound = document.querySelector('.not-found')
const searchCity = document.querySelector('.search-city')
const weatherInfo = document.querySelector('.weather-info')
const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValue = document.querySelector('.humidity-value-txt')
const windValue = document.querySelector('.wind-value-txt')
const weatherImg = document.querySelector('.weather-summary-img')
const currentDate = document.querySelector('.current-date-txt')
const forecastInfo = document.querySelector('.forecast-items-container')


const APIKey = '8c9c3602c0fe8759db10e72023dc0041';

window.addEventListener("DOMContentLoaded", () => {
    const audio = document.querySelector("audio");
    const muteButton = document.getElementById("mute-button");

    audio.volume = 0.3; // Set initial volume to 50%

    const playAudio = () => {
        audio.muted = false;
        audio.play().catch(error => console.log("Audio playback failed:", error));
        // Remove the event listener once audio starts playing
        window.removeEventListener("click", playAudio);
    };

    // Add event listener for user interaction to start the audio
    window.addEventListener("click", playAudio);

    // Add event listener for the mute/unmute button
    muteButton.addEventListener("click", () => {
        audio.muted = !audio.muted; // Toggle the muted property
        muteButton.textContent = audio.muted ? "Unmute" : "Mute"; // Update button text
    });
});

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    } 
})
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city){
    const APIUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${APIKey}&units=metric`

    const response = await fetch(APIUrl)

    return response.json()
}

function getWeatherIcon(id){
    console.log(id)

    if (id == 800) return 'sun-unscreen.gif'
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain-unscreen.gif'
    if (id <= 622) return 'snow.svg'
    if (id <=781) return 'atmosphere.svg'
 
    else return 'weather-unscreen.gif'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod != 200){
        showDisplaySection(notFound)
        return
    }

    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed},
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValue.textContent = humidity
    windValue.textContent = speed + ' M/s'
    currentDate.textContent = getCurrentDate()

    weatherImg.src = `C:/Users/HP/OneDrive - UTHM/Desktop/VisualCode/WheatherApp/assets/weather/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfo)
    
}

async function updateForecastsInfo(city){
    const forecastData = await getFetchData('forecast', city)
    const timeTaken ='12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastInfo.innerHTML= ''
    forecastData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastsItems(forecastWeather)
        }
    })
 
}

function updateForecastsItems(weatherData){
    console.log(weatherData)
    cont={
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem =`
        <div class="forecast-items">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="C:/Users/HP/OneDrive - UTHM/Desktop/VisualCode/WheatherApp/assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp) + '°C'}</h5>
        </div>
    `
    forecastInfo.insertAdjacentHTML('beforeend', forecastItem)

}

function showDisplaySection(section){
    [weatherInfo, searchCity, notFound]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}



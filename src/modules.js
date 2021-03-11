import { DateTime } from "luxon";
import {buildChart} from './hourlyChart.js'
import {getGeo} from './api.js'


const weatherModule = (() => {
    let fahrenheit = false;
    let currentTime;
    let timer;

    function changeTemperatureButton() {
        const c = document.querySelectorAll('.celsius-bold');
        const f = document.querySelectorAll('.fahrenheit-bold');
        f.forEach(e => {
            e.classList.toggle('fw-bold');
        })
        c.forEach(e => {
            e.classList.toggle('fw-bold');
        })

        if (fahrenheit == false) {
            fahrenheit = true;
        } else if (fahrenheit == true) {
            fahrenheit = false;
        }
        const city = document.getElementById('current-city').textContent;
        const data = getGeo(city)
        data.then(response => {
            displayData(response)
        }).catch(err => {
            console.log(err);
        })
    };

    // display data from the request
    function displayData(data) {
        currentTime = data.current.dt
        clearInterval(timer);
        const xAxis = []
        const yAxis = []
        for (let i = 0; i < 24; i++) {
            yAxis.push(roundToNearest(data.hourly[i].temp))
        }
        for (let i = 0; i < 24; i++) {
            xAxis.push(convertTime(data.hourly[i].dt, data.timezone).substr(0, 2))
        }
        
        xAxis[0] = 'Now'
        buildChart(xAxis, yAxis)

        changeWeatherIcons(data)
        createSevenDays(data);
        document.getElementById('current-temp').textContent = roundToNearest(data.current.temp) + '°';
        document.getElementById('high-main').textContent ='Highest: ' + roundToNearest(data.daily[0].temp.max) + '°';
        document.getElementById('low-main').textContent = 'Lowest: ' + roundToNearest(data.daily[0].temp.min) + '°';
        document.getElementById('current-city').textContent = data.city;
        // Set time on top of the page
        showCurrentTime(currentTime, data.timezone);
        timer = setInterval(() => {
            showCurrentTime(currentTime, data.timezone);
        },1000);

        document.getElementById('feels-like').textContent = roundToNearest(data.current['feels_like']) + '°'
        if (returnUnits() == 'metric') {
            document.getElementById('wind').textContent = roundToNearest(data.current['wind_speed']) + ' m/s'
        } else if (returnUnits() == 'imperial') {
            document.getElementById('wind').textContent = roundToNearest(data.current['wind_speed']) + ' mph'
        }
        
        document.getElementById('humidity').textContent = data.current.humidity + '%'
        document.getElementById('pressure').textContent = data.current.pressure + ' hPa'
        document.getElementById('sunrise').textContent = convertTime(data.current.sunrise, data.timezone);
        document.getElementById('sunset').textContent = convertTime(data.current.sunset, data.timezone)
        /*
        */
    }

     function changeWeatherIcons(data) {
        const currentIcon = document.getElementById('main-weather-icon');
        if (data.current.sunrise < data.current.dt && data.current.dt < data.current.sunset) {
            currentIcon.classList.add(dayIcons[data.current.weather[0].main])
            colorModule.changeColorScheme(currentIcon.classList[1], dayIcons)
        } else {
            currentIcon.classList.add(nightIcons[data.current.weather[0].main])
            colorModule.changeColorScheme(currentIcon.classList[1], nightIcons)    
        }
        document.getElementById('current-condition').textContent = data.current.weather[0].main
    }

    function roundToNearest(temp) {
        const rounded = Math.floor(temp)
        if (temp - rounded > 0.5) {
            return Math.floor(temp+1)
        } else {
            return rounded
        }
    }
    
    function convertTime(time, timezone){
        let local = DateTime.fromSeconds(time);
        let rezoned = local.setZone(timezone);
        return rezoned.toFormat('HH:mm');
    }

    function showCurrentTime(time, timezone) {
        currentTime++
        let local = DateTime.fromSeconds(time);
        let rezoned = local.setZone(timezone);
        document.getElementById('current-time').textContent = rezoned.toFormat('EEE, HH:mm:ss');
    }

    const dayIcons = {
        Thunderstorm: 'wi-day-thunderstorm',
        Clouds: 'wi-day-cloudy',
        Drizzle: 'wi-day-showers',
        Rain: 'wi-day-rain',
        Snow: 'wi-day-snow',
        Clear: 'wi-day-sunny',
        Mist: 'wi-fog',
        Smoke: 'wi-smoke',
        Haze: 'wi-day-haze',
        Dust: 'wi-dust',
        Fog: 'wi-fog',
        Sand: 'wi-sandstorm',
        Dust: 'wi-dust',
        Ash: 'wi-volcano',
        Squall: 'wi-strong-wind',
        Tornado: 'wi-tornado' 
    }

    const nightIcons = {
        Thunderstorm: 'wi-night-alt-thunderstorm',
        Clouds: 'wi-night-alt-cloudy',
        Drizzle: 'wi-night-alt-showers',
        Rain: 'wi-night-rain',
        Snow: 'wi-night-snow',
        Clear: 'wi-night-clear',
        Mist: 'wi-fog',
        Smoke: 'wi-smoke',
        Haze: 'wi-day-haze',
        Dust: 'wi-dust',
        Fog: 'wi-fog',
        Sand: 'wi-sandstorm',
        Dust: 'wi-dust',
        Ash: 'wi-volcano',
        Squall: 'wi-strong-wind',
        Tornado: 'wi-tornado' 
    }


    function createSevenDays(data) {
        const body = document.querySelector('tbody');
        body.innerHTML = ''
        for (let i = 1; i < 8; i++) {
            let local = DateTime.fromSeconds(data.daily[i].dt);
            let rezoned = local.setZone(data.timezone);
            const tRow = document.createElement('tr');
            const tRowHead = document.createElement('th');
            tRowHead.style.textAlign = 'left';
            tRowHead.scope = 'row';
            tRowHead.textContent = rezoned.toFormat('EEEE'); 

            const weatherCell = document.createElement('td');
            const weather = document.createElement('i');
            weather.setAttribute('class', 'wi');
            weather.classList.add('fs-3');
            weather.classList.add(dayIcons[data.daily[i].weather[0].main])
            weatherCell.appendChild(weather)

            const precipitation = document.createElement('td');
            precipitation.textContent = Math.floor((parseFloat(data.daily[i].pop) * 100), 0) + '%';
            precipitation.classList.add('d-none');
            precipitation.classList.add('d-sm-table-cell');

            const humidity = document.createElement('td');
            humidity.textContent = data.daily[i].humidity + '%';
            humidity.classList.add('d-none');
            humidity.classList.add('d-sm-table-cell');

            const minMax = document.createElement('td');
            minMax.textContent = `${Math.floor(data.daily[i].temp.min, 1)}° | ${Math.floor(data.daily[i].temp.max, 1)}°`;
            minMax.style.textAlign = 'right';

            tRow.appendChild(tRowHead);
            tRow.appendChild(weatherCell);
            tRow.appendChild(precipitation);
            tRow.appendChild(humidity);
            tRow.appendChild(minMax);
            body.appendChild(tRow);
        }
    }
    function returnUnits() {
        if (fahrenheit == false) {
            return 'metric'
        } else {
            return 'imperial'
        }
    }

    return {changeTemperatureButton, displayData, timer, returnUnits, nightIcons, dayIcons}
})();

const colorModule = (() => {
    function changeColorScheme(currentIcon, dayOrNightIcons) {
        for (let i in dayOrNightIcons) {
            if (dayOrNightIcons[i] == currentIcon) {
                
            }
        }
        document.body.setAttribute('class', 'dark-theme')
    }
    return {changeColorScheme}
})();


export {weatherModule}
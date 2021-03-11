import {weatherModule} from './modules.js'


async function getMoreData(lon, lat) {
    const id = 'e3496c6b36dcdfcc1b4f8ac7e4da9e33'
    const unit = weatherModule.returnUnits()
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=${unit}&appid=${id}`
    const response = await fetch(url);
    if (response.status != 200) {
        return Promise.reject('City not found')
    } else {
        const weatherData = await response.json()
        return weatherData
    }
}

async function getGeo(city) {
    const key = 'a0ff461a3d34477fbf1a1be2ef965656'
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&abbrv=1&limit=1&key=${key}`
    const response = await fetch(url)
    
    
    if (response.status != 200) {
        return Promise.reject('City not found')
    } else {
        const geoData = await response.json()
        if (geoData.total_results == 0) {
            return Promise.reject('City not found')
        }
        
        const lon = geoData.results[0].geometry.lng
        const lat = geoData.results[0].geometry.lat
        const weatherData = await getMoreData(lon, lat)
        const cityName = city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
        weatherData.city = cityName
        return weatherData
    }
}



function handleNotFound() {
  const container = document.getElementById('alert');
  const alert = document.createElement('div');
  alert.textContent = "Oops, your place wasn't found!"
  alert.className = 'alert alert-light alert-dismissible fade show text-center';
  const closeButton = document.createElement('button');
  
  closeButton.type = 'button';
  closeButton.className = 'btn-close'
  closeButton.setAttribute('data-bs-dismiss', 'alert')
  alert.appendChild(closeButton)
  container.appendChild(alert)
}

export {getGeo, handleNotFound}
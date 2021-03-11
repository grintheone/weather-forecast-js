import {weatherModule} from './modules.js'

async function getCurrentData(city) {
    const id = 'e3496c6b36dcdfcc1b4f8ac7e4da9e33'
    const url = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${id}`
    const response = await fetch(url);
    if (response.status != 200) {
        return Promise.reject('City not found')
    } else {
        const weatherData = await response.json()
        const moreData = await getMoreData(weatherData.coord.lon, weatherData.coord.lat)
        moreData.city = weatherData.name
        return moreData
    }
}

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


export {getCurrentData}
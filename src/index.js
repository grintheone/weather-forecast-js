import './style/style.css'
import {getCurrentData} from './api.js'
import {weatherModule} from './modules.js'

document.getElementById("navbarSearch").addEventListener('submit', formListener)
document.getElementById("navbarSearch-sm").addEventListener('submit', formListener)



function formListener(e) {
    e.preventDefault()
    let city;
    const input = document.querySelectorAll('form input');
    if (input[0].value != '') {
        city = input[0].value
    } else {
        city = input[1].value
    }
    
    const data = getCurrentData(city)
    data.then(response => {
        weatherModule.displayData(response)
        e.target.reset();
    }).catch(err => {
        console.log(err);
        e.target.reset()
    })
}


const data = getCurrentData('Moscow')
    data.then(response => {
        weatherModule.displayData(response, 'Moscow')
    }).catch(err => {
        console.log(err);
    })
   



let changeScaleButtons = document.querySelectorAll('.change-temp');
changeScaleButtons[0].addEventListener('click', weatherModule.changeTemperatureButton)
changeScaleButtons[1].addEventListener('click', weatherModule.changeTemperatureButton)



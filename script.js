const wheatherInput = document.getElementById("wheatherInput");
const search = document.querySelector('.search');

const container = document.querySelector('.container');
const errorWindow = document.createElement('div')
errorWindow.classList.add("errorWindow");
const wheather = document.querySelector('.wheather');
const city = document.querySelector('.cityName');
const img = document.querySelector('.img');
const wheatherToday = document.querySelector('.wheatherToday');
const feel = document.querySelector('.feel');
const feelValue = document.querySelector('.feelValue')
const wheatherDesctiption = document.querySelector('.wheatherDesctiption');

const valueHumidity = document.querySelector('.valueHumidity');
const valueWind = document.querySelector('.valueWind');
const valueVisibility = document.querySelector('.valueVisibility');

const timing = document.querySelector('.timing')
const sunriseTime = document.querySelector('.sunriseTime');
const sunsetTime = document.querySelector('.sunsetTime');

const wheatherWeek = document.querySelector('.wheatherWeek')
const weatherWeek7 = document.querySelector('.weatherWeek7');

const API_KEY = '11713de067decd9facb8a15bac2f5256';
const city_name = 'Санкт-Петербург'

function ifPlus(data, selector) {
  if (data > 0){
    selector.textContent = "+" + Math.round(data) + "°";
  } else {
    selector.textContent = Math.round(data) + "°";
  }
}

async function getWeather(cityText = city_name) {
  try {
    errorWindow.remove();
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityText}&appid=${API_KEY}&units=metric&lang=ru`);
    const data = await res.json();
    // console.log(data)
    
    city.textContent = data.name;
    img.src = `https://openweathermap.org/payload/api/media/file/${data.weather[0].icon}.png`;
    img.alt = data.weather[0].description;
    ifPlus(data.main.temp, wheatherToday);
    ifPlus(data.main.feels_like, feelValue)
    
    valueHumidity.textContent = data.main.humidity + " %";
    valueWind.textContent = Math.round(data.wind.speed) + " м/с";
    valueVisibility.textContent = (data.visibility/1000) + " км";
    const description = data.weather[0].description
    wheatherDesctiption.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    const options = {hour: 'numeric', minute: "numeric"};
    sunriseTime.textContent = new Date(data.sys.sunrise * 1000).toLocaleString('ru-RU', options); 
    sunsetTime.textContent = new Date(data.sys.sunset * 1000).toLocaleString('ru-RU', options);

    wheatherInput.value = ''

    const res2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityText}&appid=${API_KEY}&units=metric&lang=ru`);
    const data2 = await res2.json();

    const filtered = data2.list.filter(item => item.dt_txt.includes('15:00:00'));
    weatherWeek7.innerHTML = "";
    function renderForcast() {
      filtered.forEach(item => {
        // weatherWeek7.innerHTML = "";
        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleString('ru-RU', {weekday: 'long'})

        const week = document.createElement('div')
        week.classList.add('week')
        const left = document.createElement('div');
        left.classList.add('left')
        const day = document.createElement('div');
        day.classList.add('day')
        day.textContent = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        const weelIcon = document.createElement('img');
        weelIcon.classList.add('weelIcon')
        weelIcon.src = `https://openweathermap.org/payload/api/media/file/${item.weather[0].icon}.png`;
        const descriptionWeek = document.createElement('div');
        descriptionWeek.classList.add('descriptionWeek')
        const description = item.weather[0].description
        descriptionWeek.textContent = description.charAt(0).toUpperCase() + description.slice(1);
        // descriptionWeek.textContent = item.weather[0].description;
        const right = document.createElement('div');
        right.classList.add('right')

        const weatherMax = document.createElement('div');
        weatherMax.classList.add('weatherMax')
        ifPlus(item.main.temp_max, weatherMax);
        
        const weatherMin = document.createElement('div');
        weatherMin.classList.add('weatherMin')
        ifPlus(item.main.temp_min, weatherMin);

        
        left.append(day, weelIcon, descriptionWeek)
        right.append(weatherMax, weatherMin)
        week.append(left, right)
        weatherWeek7.append(week)
      });
    }
    renderForcast()

    
  } catch(error) {
    errorWindow.textContent = "Ты еблан? Нормально город напиши!"

    container.append(errorWindow)
  }
}

search.addEventListener('click', () => {
  if(!wheatherInput.value.trim()){
    alert('Поле не заполнено!');
  } else {
    getWeather(wheatherInput.value);
  }
  
});

wheatherInput.addEventListener('keydown', (event) => {
    if(event.key === "Enter"){
      getWeather(wheatherInput.value);
    }
});

getWeather()

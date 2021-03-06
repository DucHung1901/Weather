// const let là khai báo dữ liệu
// lấy nội dung:    let content = node.innerHTML;
// Gán nội dung:    node.innerHTML = newContent;
// newContent chính là nội dung bạn muốn gán vào node
// node chính là đối tượng cần lấy hoặc cần gán nội dung




const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const currentTempMainE1 = document.getElementById('current-temp-main');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';


// sau 1000ms thời gian sẽ được cập nhật setInterval: sau ...thời gian thì sẽ lặp lại các phép tính
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();    
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
//     nếu số giờ quy đổi >=13 thì lấy giờ đó chia lấy dư với 12, còn nếu giờ <13 thì lấy giờ đó
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    // tính toán thời gian
//     nếu giờ tính toán được < 10 thì ta để dạng 01, 02,..., còn >=10 thì ta giữ nguyên giờ tìm được. Tương tự với phút
    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);


getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;
        // gọi API
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        // / kiểm tra / xem giá trị của data
        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){


    let {humidity, pressure, sunrise, sunset, wind_speed, temp, visibility} = data.current;
    let {description, icon} = data.current.weather[0];  
    // truyền dữ liệu của timezone từ API 
    timezone.innerHTML = data.timezone;
    // tương tự, lấy kinh tuyến, vĩ tuyến của toạ độ
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    // ${humidity} sử dụng sữ liệu đã lấy về từ let{humidity}=data.current ở trên, tương tự cho các pressure,...
    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div class="pro">Humidity</div>
        <div class="para">${humidity}%</div>
    </div>
    <div class="weather-item" id="no-bor">
        <div class="pro">Pressure</div>
        <div class="para">${pressure} mb</div>
    </div>
    <div class="weather-item">
        <div class="pro">Wind Speed</div>
        <div class="para">${wind_speed} mph</div>
    </div>

    <div class="weather-item" id="no-bor">
        <div class="pro">Sunrise</div>
        <div class="para">${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div class="pro">Sunset</div>
        <div class="para">${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    <div class="weather-item no-bor" id="no-bor">
        <div class="pro">Visibility</div>
        <div class="para">${visibility/1000} Km</div>
    </div>
    
    
    `;

    currentTempMainE1.innerHTML =
    `
    <div>
        <img src="http://openweathermap.org/img/wn//${icon}@4x.png" alt="weather icon" class="w-icon">
    </div>
    <div class="weather">
        <div class="temp">${Math.round(temp)} &#176; C</div>
        <div class="desc">${description}</div>
    </div>
    `


    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })
    
    weatherForecastEl.innerHTML = otherDayForcast;
}

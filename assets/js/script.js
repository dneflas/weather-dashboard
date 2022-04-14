var searchContainer = document.getElementById("search-container");
var resultContainer = document.getElementById("result-container");
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayForcastEl = document.querySelector("#five-day-forcast");
var userFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var recentSearchesEl = document.querySelector("#recent-searches")
var recentSearches = [];

var LoadRecentSearches = function(){
    recentStoredSearches = JSON.parse(localStorage.getItem("recentStoredSearches"));

    if(recentStoredSearches) {
        recentSearches = recentStoredSearches;
        for (var i = 0; i < recentSearches.length; i++){
            addRecent(recentSearches[i]);
        };
    };
};

var formSubmitHandler = function(event){
    event.preventDefault();
    
    var cityInput = cityInputEl.value.
    trim()
    .toLowerCase()
    // cityInput = "";

    if (cityInput){
        getGeoCode(cityInput);
        addRecent(cityInput);
    } else {
        alert("Please enter a valid city");
    }

};

var getGeoCode = function(city){
    var geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city +"&appid=81899826dc7664a048a837db5523dd36"

    fetch(geoCodeUrl)
        .then(function(response){
            if (response.ok){
                response.json().then(function(data){
                    console.log(response)
                   var lat = data[0].lat;
                   var lon = data[0].lon;
                   pushRecent(city);

                   getWeather(lat, lon, city);
                });
            } else {
                alert("Error: City Not Found");
            };
        
         })
         .catch(function(error){
             alert("Unable to connect to server")
         });    
};

var getWeather = function(lat, lon, city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=81899826dc7664a048a837db5523dd36";
    console.log(apiUrl);
    fetch(apiUrl)
        .then(function(response){
            response.json().then(function(data){

                var currentDate = document.createElement("h3");
                currentDate.className= "fs-2 fw-bold";
                currentDate.textContent = city + " - " + new Date(data.current.dt*1000).toLocaleDateString("en-US");
                var currentIcon = document.createElement("img");
                currentIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
                var currentTemp = document.createElement("p");
                currentTemp.textContent = "Temp: " + data.current.temp + "°F";
                var currentHumidity = document.createElement("p");
                currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
                var currentWindSpeed = document.createElement("p");
                currentWindSpeed.textContent = "Wind: " + data.current.wind_speed + "MPH";
                var currentUvi = document.createElement("p");
                currentUvi.textContent = "UV Index: " + data.current.uvi;

                var currentCardEl = document.createElement("div");
                currentCardEl.className = "card col-12";
                    
                var currentCardBody = document.createElement("div");
                currentCardBody.className = "card-body";

                currentCardBody.append(currentDate, currentIcon, currentTemp, currentHumidity, currentWindSpeed, currentUvi)
                currentCardEl.append(currentCardBody);
                currentWeatherEl.append(currentCardEl);

                for (var i = 1; i < 6; i++){
                    var dailyDate = document.createElement("h4");
                    dailyDate.textContent = new Date(data.daily[i].dt*1000).toLocaleDateString("en-US");
                    var dailyIcon = document.createElement("img");
                    dailyIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png")
                    var dailyTemp = document.createElement("p");
                    dailyTemp.textContent = "Temp: " + data.daily[i].temp.day + "°F";
                    var dailyHumidity = document.createElement("p");
                    dailyHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
                    var dailyWindSpeed = document.createElement("p");
                    dailyWindSpeed.textContent = "Wind: " + data.daily[i].wind_speed + "MPH";
                    var dailyUvi = document.createElement("p");
                    dailyUvi.textContent = "UV Index: " + data.daily[i].uvi;
                
                    var forecastCardEl = document.createElement("div");
                    forecastCardEl.className = "card col-md-5 col-lg-2";
                    
                    var forecastCardBody =document.createElement("div");
                    forecastCardBody.className = "card-body";

                    forecastCardBody.append(dailyDate, dailyIcon, dailyTemp, dailyHumidity, dailyWindSpeed, dailyUvi)
                    forecastCardEl.append(forecastCardBody);
                    fiveDayForcastEl.append(forecastCardEl);
                }
            
            });
        });
};


var displayWeather = function(){
    
}

var addRecent = function(city){
    var recentSearchItem = document.createElement("button");
    recentSearchItem.className = "recent-search-item d-block btn btn-secondary"
    recentSearchItem.textContent = city

    recentSearchesEl.prepend(recentSearchItem);
};

var pushRecent = function(city){
    recentSearches.push(city);
    localStorage.setItem("recentStoredSearches", JSON.stringify(recentSearches));


}


LoadRecentSearches();
userFormEl.addEventListener("submit", formSubmitHandler);
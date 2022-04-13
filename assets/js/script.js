var searchContainer = document.getElementById("search-container");
var resultContainer = document.getElementById("result-container");
var userFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var recentSearchesEl = document.querySelector("#recent-searches")
var recentSearches = [];

var LoadRecentSearches = function(){
    recentStoredSearches = JSON.parse(localStorage.getItem("recentStoredSearches"));

    if(!recentStoredSearches) {
        recentStoredSearches = recentSearches
    };

    recentSearches = recentStoredSearches;

    for (var i = 0; i < recentSearches.length; i++){
        addRecent(recentSearches[i].city);
    }
};

var formSubmitHandler = function(event){
    event.preventDefault();
    
    var cityInput = cityInputEl.value.
    trim()
    .toLowerCase()


    if (cityInput){
        getGeoCode(cityInput);
        addRecent(cityInput);
        cityInput = "";


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
                   pushRecent(city, lat, lon);

                   getWeather(lat, lon);
                });
            } else {
                alert("Error: City Not Found");
            };
        
         })
         .catch(function(error){
             alert("Unable to connect to server")
         });    
};

var getWeather = function(lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=81899826dc7664a048a837db5523dd36";
    fetch(apiUrl)
        .then(function(response){
            response.json().then(function(data){
                console.log(data);
                var currentDate = new Date(data.current.dt*1000).toLocaleDateString("en-US");
                var currentIcon = "http://openweathermap.org/img/wn/" + data.current.weather.icon + "@2x.png"
                var currentTemp = data.current.temp + "°F";
                var currentHumidity = data.current.humidity + "%";
                var currentWindSpeed = data.current.wind_speed + "MPH";
                var currentUvi = data.current.uvi;

                for (var i = 1; i < 6; i++){
                    var dailyDate = new Date(data.daily[i].dt*1000).toLocaleDateString("en-US");
                    var dailyIcon = "http://openweathermap.org/img/wn/" + data.daily[i].weather.icon + "@2x.png"
                    var dailyTemp = data.daily[i].temp + "°F";
                    var dailyHumidity = data.daily[i].humidity + "%";
                    var dailyWindSpeed = data.daily[i].wind_speed + "MPH";
                    var dailyUvi = data.daily[i].uvi;
                }

            });
        });
};

var addRecent = function(city){
    var recentSearchItem = document.createElement("button");
    recentSearchItem.className = "recent-search-item d-block btn btn-secondary"
    recentSearchItem.textContent = city

    recentSearchesEl.prepend(recentSearchItem);
};

var pushRecent = function(city, lat, lon){
    recentSearches.push({"city": city, "lat": lat, "lon": lon});
    localStorage.setItem("recentStoredSearches", JSON.stringify(recentSearches));


}


LoadRecentSearches();
userFormEl.addEventListener("submit", formSubmitHandler);


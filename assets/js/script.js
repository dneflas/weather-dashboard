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
        // var city = recentSearches[i].replace("%20", " ")
        addRecent(recentSearches[i]);
    }
}

var formSubmitHandler = function(event){
    event.preventDefault();
    
    var cityInput = cityInputEl.value.
    trim()
    .toLowerCase()
    .replace(" ", "%20");

    if (cityInput){
        getGeoCode(cityInput);
        cityInput = "";


    } else {
        alert("Please enter a valid city");
    }

}

var getGeoCode = function(city){
    var geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city +"&appid=81899826dc7664a048a837db5523dd36"

    fetch(geoCodeUrl)
        .then(function(response){
            if (response.ok){
                response.json().then(function(data){
                    console.log(response)
                    recentSearches.push(city);
                    localStorage.setItem("recentStoredSearches", JSON.stringify(recentSearches));
                    addRecent(city);
                   var lat = data[0].lat;
                   var lon = data[0].lon;
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=81899826dc7664a048a837db5523dd36";
    fetch(apiUrl)
        .then(function(response){
            console.log(response);
        });
};

var addRecent = function(city){
    var recentSearchItem = document.createElement("button");
    recentSearchItem.className = "d-block btn btn-secondary"
    recentSearchItem.textContent = city.replace("%20", " ");

    recentSearchesEl.appendChild(recentSearchItem);
}



LoadRecentSearches();
userFormEl.addEventListener("submit", formSubmitHandler);

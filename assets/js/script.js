var searchContainer = document.getElementById("search-container");
var resultContainer = document.getElementById("result-container");
var userFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");

var formSubmitHandler = function(event){
    event.preventDefault();
    
    var cityInput = cityInputEl.value.
    trim()
    .toLowerCase()
    .replace(" ", "%20");
    
    console.log(cityInput);
    getGeoCode(cityInput);

}

var getGeoCode = function(city){
    var geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city +"&appid=81899826dc7664a048a837db5523dd36"

    fetch(geoCodeUrl)
        .then(function(response){
            if (response.ok){
                response.json().then(function(data){
                   var lat = data[0].lat;
                   var lon = data[0].lon;
                   console.log(response);
                });
            } else {
                alert("Please enter a valid city");
            };
        
    });
    
};

userFormEl.addEventListener("submit", formSubmitHandler);

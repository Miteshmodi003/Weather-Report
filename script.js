let cityName, queryUrl;
const searchBtn = $(".cityinput");

// Search for any city weather
searchBtn.on('submit', function (event) {
    event.preventDefault();
    let cityName = $("#citySearch").val();
    displayCityWeather(cityName);
});

// Search History List
$("#ullist").on('click', function (event) {
    clearPreviousCityData();
    let listItem = event.target.id;
    // let listItem = $(this).text();
    console.log("Search History: " + listItem);
    if (!!listItem) {
        displayCityWeather(listItem, false);
    }
});

// retrieves last city search from local storage along with search list
function appendToCurrentWeather() {
    let city = localStorage.getItem("cityname"),
        temp = localStorage.getItem("temperature"),
        humidityVal = localStorage.getItem("humidity"),
        windSpeedVal = localStorage.getItem("windspeed"),
        iconWeather = localStorage.getItem("iconWeather"),
        date = localStorage.getItem("currentDate"),
        uvindex = localStorage.getItem("uvindex");
    if (!!(city || temp || humidityVal || windSpeedVal || iconWeather || windSpeedVal || date)) {
        clearPreviousCityData();
        let imgIcon = $("<img>");
        imgIcon.attr('src', iconWeather);
        imgIcon.attr('id', 'iconWeather');
        $("#city-name").append(city + " " + date).append(imgIcon);
        $("#temperature").append("Temperature: " + temp + " °F");
        $("#humidity").append("Humidity: " + humidityVal + "%");
        $("#wind-speed").append("Wind Speed: " + windSpeedVal + " mph");
        $("#uv-index").append("UV Index: " + uvindex);

        let cityNames = JSON.parse(localStorage.getItem("searchhistory"));
        if (cityNames !== [] || cityNames.length !== 0) {
            $("#search-history").removeClass("d-none");
            cityNames.forEach(cityName => {
                let liCity = $("<li>");
                liCity.text(cityName);
                liCity.addClass('list-group-item searchHistoryListItem');
                liCity.attr('id', cityName);
                $("#ullist").append(liCity);
            });
        }

        let daily = JSON.parse(localStorage.getItem("forecastdaily"));
        for (var i = 0; i < 5; i++) {
            let div = $("<div>");
            div.attr("class", "col-md-2 card text-white bg-primary");
            div.attr("max-width", "11rem");
            if (i > 0) {
                div.attr("class", "col-md-2 card text-white bg-primary ml-2");
            }
            let date = $("<h5 class='futureDate'+ [i]>").append(moment().add(i + 1, 'days').format('MM/DD/YYYY'));

            let weatherIcon = $("<img src='http://openweathermap.org/img/wn/" + daily[i].weather[0].icon + ".png' width='50px' height='50px'/>");

            let dailyTemp = +((parseFloat(daily[i].temp.day) - 273.15) * (9 / 5) + 32).toFixed(2);
            let temp = $("<p>").append("Temp: " + dailyTemp + " °F");

            let humidity = $("<p>").append("Humidity: " + daily[i].humidity + "%");

            div.append(date, weatherIcon, temp, humidity);
            $("#forecast").append(div);
        }
    }
    else {
        $("#city-name").append("Enter City Name");
        $("#temperature").append("Temperature: ");
        $("#humidity").append("Humidity: ");
        $("#wind-speed").append("Wind Speed: ");
        $("#uv-index").append("UV Index: ");
        $("#search-history").addClass("d-none");
    }
}

appendToCurrentWeather();

function clearPreviousCityData() {
    $("#city-name").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#wind-speed").empty();
    $("#uv-index").empty();
    $("#forecast").empty();
}
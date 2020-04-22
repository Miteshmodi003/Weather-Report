$(document).ready(function () {
    let cityName, queryUrl;
    const searchBtn = $(".cityinput");

    searchBtn.on('submit', function (event) {
        event.preventDefault();
        let cityName = $("#citySearch").val();
        displayCityWeather(cityName);
        $("#ullist li").on('click', function () {
            clearPreviousCityData();
            let listItem = $(this).text();
            console.log("Search History: " + listItem);
            if (!!listItem) {
                displayCityWeather(listItem, false);
            }
            $(this).off('click');
        });
    });

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
                cityNames.foreach(cityName => {
                    $(".list-group").append("<li class='list-group-item searchHistoryListItem'>" + cityName + "</li>");
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

    function displayCityWeather(cityName, addNewItem = true) {
        clearPreviousCityData();
        const API_KEY = "33c01a2efd123f0847e86c41099d967c";

        if (!!cityName) {
            queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_KEY;

            $.ajax({
                url: queryUrl,
                method: "GET"
            }).then(function (response) {
                let getCityName = response.name,
                    currentTemp = +((parseFloat(response.main.temp) - 273.15) * (9 / 5) + 32).toFixed(2),
                    humidity = response.main.humidity,
                    windSpeed = response.wind.speed,
                    lat = response.coord.lat,
                    lon = response.coord.lon,
                    icon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png",
                    currentDate = moment().format('MM/DD/YY'),
                    uvIndex;

                let imgIcon = $("<img>");
                imgIcon.attr('src', icon);
                imgIcon.attr('id', 'iconWeather');
                $("#city-name").append(getCityName + " " + currentDate).append(imgIcon);
                $("#temperature").append("Temperature: " + currentTemp + " °F");
                $("#humidity").append("Humidity: " + humidity + "%");
                $("#wind-speed").append("Wind Speed: " + windSpeed + " mph");

                localStorage.setItem("cityname", getCityName);
                localStorage.setItem("currentDate", currentDate);
                localStorage.setItem("temperature", currentTemp);
                localStorage.setItem("humidity", humidity);
                localStorage.setItem("windspeed", windSpeed);
                localStorage.setItem("iconWeather", icon);
                localStorage.setItem("searchhistory", JSON.stringify(getCityName));

                // Append to Search History list
                if (addNewItem) {
                    $("#search-history").removeClass("d-none");
                    $(".list-group").append("<li class='list-group-item searchHistoryListItem'>" + getCityName + "</li>");
                }

                // API for UV Index 
                $.ajax({
                    url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + API_KEY + "&lat=" + lat + "&lon=" + lon,
                    method: "GET"
                }).then(function (result) {
                    uvIndex = result.value;
                    $("#uv-index").append("UV Index: " + uvIndex);
                    localStorage.setItem("uvindex", uvIndex);
                });

                // Forecast for five days
                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY,
                    method: "GET"
                }).then(function (results) {
                    let daily = results.daily;
                    localStorage.setItem("forecastdaily", JSON.stringify(daily));
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
                });
            });
        }
    }

    function clearPreviousCityData() {
        $("#city-name").empty();
        $("#temperature").empty();
        $("#humidity").empty();
        $("#wind-speed").empty();
        $("#uv-index").empty();
        $("#forecast").empty();
    }

    appendToCurrentWeather();
});


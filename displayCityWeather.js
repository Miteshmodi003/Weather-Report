// Display City Weather with API calls
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
            

            // Append to Search History list
            if (addNewItem) {
                let cityNames = JSON.parse(localStorage.getItem("searchhistory")) || [];
                cityNames.push(getCityName);
                console.log(cityName);
                localStorage.setItem("searchhistory", JSON.stringify(cityNames));
                $("#search-history").removeClass("d-none");
                let liCity = $("<li>");
                liCity.text(getCityName);
                liCity.addClass('list-group-item searchHistoryListItem');
                liCity.attr('id', getCityName);
                $("#ullist").append(liCity);
            }

            // API for UV Index 
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + API_KEY + "&lat=" + lat + "&lon=" + lon,
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

// Clear previously appended html data
function clearPreviousCityData() {
    $("#city-name").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#wind-speed").empty();
    $("#uv-index").empty();
    $("#forecast").empty();
}
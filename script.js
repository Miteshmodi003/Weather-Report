$(document).ready(function() { 
    let cityName, queryUrl;
    const searchBtn = $("#searchBtn");
    
    searchBtn.on('click', function(event){
        displayCityWeather(event);
    });

    // When a search history item is clicked
    // $(".searchHistoryListItem").click(function(event) {
    //     event.preventDefault();
    //     clearPreviousCityData();
    //     console.log("fsvs");
    //     const API_KEY = "33c01a2efd123f0847e86c41099d967c";
    //     cityName = $(this).val();
        
    //     if (!!cityName) {
    //         queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_KEY;
            
    //         $.ajax({
    //             url: queryUrl,
    //             method: "GET"
    //           }).then(function(response) {
    //             let getCityName = response.name,
    //             currentTemp = response.main.temp,
    //             humidity = response.main.humidity,
    //             windSpeed = response.wind.speed, 
    //             lat = response.coord.lat,
    //             lon = response.coord.lon,
    //             icon = $("<img src='http://openweathermap.org/img/wn/" + response.weather[0].icon +".png' />"),
    //             currentDate = moment().format('MM/DD/YY'),
    //             uvIndex;
    //             $("#city-name").append(getCityName + " " + currentDate).append(icon);
    //             $("#temperature").append("Temperature: " + currentTemp + " °F");
    //             $("#humidity").append("Humidity: " + humidity + "%");
    //             $("#wind-speed").append("Wind Speed: " + windSpeed + " mph");

    //             // Append to Search History list
    //             $(".list-group").append("<li class='list-group-item searchHistoryListItem'>"+ getCityName + "</li>");

    //             // API for UV Index 
    //             $.ajax({
    //                 url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + API_KEY + "&lat=" + lat + "&lon=" + lon,
    //                 method: "GET"
    //               }).then(function(result) {
    //                 uvIndex = result.value;
    //                 $("#uv-index").append("UV Index: " + uvIndex);
    //               });

    //               // Forecast for five days
    //             $.ajax({
    //                 url: "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon="+ lon +"&appid="+ API_KEY,
    //                 method: "GET"
    //             }).then(function(results) {
    //                 let daily = results.daily;
    //                 for (var i = 0; i < 5; i++) {
    //                     let div = $("<div>");
    //                     div.attr("class", "col-md-2 card text-white bg-primary");
    //                     div.attr("max-width", "11rem");
    //                     if (i > 0){
    //                         div.attr("class", "col-md-2 card text-white bg-primary ml-2");
    //                     }
    //                     let date =  $("<h5>").append(moment().add(i+1,'days').format('MM/DD/YYYY'));
    //                     let weatherIcon = $("<img src='http://openweathermap.org/img/wn/" + daily[i].weather[0].icon +".png' width='50px' height='50px'/>");
    //                     let temp = $("<p>").append("Temp: " + daily[i].temp.day + " °F");
    //                     let humidity = $("<p>").append("Humidity: " + daily[i].humidity + "%");
    //                     div.append(date, weatherIcon,temp, humidity);
    //                     $("#forecast").append(div);
    //                 }
    //             });  
    //           });
    //     }
    // });

    function displayCityWeather(event){
        event.preventDefault();
        clearPreviousCityData();
        const API_KEY = "33c01a2efd123f0847e86c41099d967c";
        cityName = $("#citySearch").val();
        
        if (!!cityName) {
            queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_KEY;
            
            $.ajax({
                url: queryUrl,
                method: "GET"
              }).then(function(response) {
                let getCityName = response.name,
                currentTemp = response.main.temp,
                humidity = response.main.humidity,
                windSpeed = response.wind.speed, 
                lat = response.coord.lat,
                lon = response.coord.lon,
                icon = $("<img src='http://openweathermap.org/img/wn/" + response.weather[0].icon +".png' id='iconWeather'/>"),
                currentDate = moment().format('MM/DD/YY'),
                uvIndex;
                $("#city-name").append(getCityName + " " + currentDate).append(icon);
                $("#temperature").append("Temperature: " + currentTemp + " °F");
                $("#humidity").append("Humidity: " + humidity + "%");
                $("#wind-speed").append("Wind Speed: " + windSpeed + " mph");

                localStorage.setItem("#city-name", getCityName);
                localStorage.setItem("#temperature", currentTemp);
                localStorage.setItem("#humidity", humidity);
                localStorage.setItem("#wind-speed", windSpeed);
                localStorage.setItem("#iconWeather", icon);

                localStorage.getItem("#city-name");
                localStorage.getItem("#temperature");
                localStorage.getItem("#humidity");
                localStorage.getItem("#wind-speed");
                localStorage.getItem("#iconWeather");

                // Append to Search History list
                $(".list-group").append("<li class='list-group-item searchHistoryListItem'>"+ getCityName + "</li>");

                // API for UV Index 
                $.ajax({
                    url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + API_KEY + "&lat=" + lat + "&lon=" + lon,
                    method: "GET"
                  }).then(function(result) {
                    uvIndex = result.value;
                    $("#uv-index").append("UV Index: " + uvIndex);
                    localStorage.setItem("#uv-index", uvIndex);
                  });

                  // Forecast for five days
                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon="+ lon +"&appid="+ API_KEY,
                    method: "GET"
                }).then(function(results) {
                    let daily = results.daily;
                    for (var i = 0; i < 5; i++) {
                        let div = $("<div>");
                        div.attr("class", "col-md-2 card text-white bg-primary");
                        div.attr("max-width", "11rem");
                        if (i > 0){
                            div.attr("class", "col-md-2 card text-white bg-primary ml-2");
                        }
                        let date =  $("<h5 class='futureDate'+ [i]>").append(moment().add(i+1,'days').format('MM/DD/YYYY'));
                        
                        let weatherIcon = $("<img src='http://openweathermap.org/img/wn/" + daily[i].weather[0].icon +".png' width='50px' height='50px'/>");
                        
                        let temp = $("<p>").append("Temp: " + daily[i].temp.day + " °F");
                        
                        let humidity = $("<p>").append("Humidity: " + daily[i].humidity + "%");
                        div.append(date, weatherIcon,temp, humidity);
                        $("#forecast").append(div);
                    }
                });  
              });
        } 
    }

    function clearPreviousCityData(){
        $("#city-name").empty();
        $("#temperature").empty();
        $("#humidity").empty();
        $("#wind-speed").empty();
        $("#uv-index").empty();
        $("#forecast").empty();
    }
    


});


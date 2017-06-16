'use strict';

$(".row").hide()

$(document).ready(function () {
    var opts = {
        lines: 10 // The number of lines to draw
            ,
        length: 20 // The length of each line
            ,
        width: 14 // The line thickness
            ,
        radius: 30 // The radius of the inner circle
            ,
        scale: 1 // Scales overall size of the spinner
            ,
        corners: 1 // Corner roundness (0..1)
            ,
        color: '#b5b5b5' // #rgb or #rrggbb or array of colors
            ,
        opacity: 0.25 // Opacity of the lines
            ,
        rotate: 0 // The rotation offset
            ,
        direction: 1 // 1: clockwise, -1: counterclockwise
            ,
        speed: 1 // Rounds per second
            ,
        trail: 60 // Afterglow percentage
            ,
        fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            ,
        zIndex: 2e9 // The z-index (defaults to 2000000000)
            ,
        className: 'spinner' // The CSS class to assign to the spinner
            ,
        top: '50%' // Top position relative to parent
            ,
        left: '50%' // Left position relative to parent
            ,
        shadow: false // Whether to render a shadow
            ,
        hwaccel: false // Whether to use hardware acceleration
            ,
        position: 'absolute' // Element positioning
    }
    var target = document.getElementById('intro-bg')
    var spinner = new Spinner(opts).spin(target);

    var locationApiUrl = "https://ipinfo.io/json"
    $.ajax({
            url: locationApiUrl,
            type: 'GET'
        })
        .done(function (locationData) {
            console.log(locationData);

            var loc = locationData.loc.split(",");

            var units = "metric";
            var weatherApiUrl = config.BASE_URL + config.API_KEY + '&lat=' + loc[0] + '&lon=' + loc[1] + '&units=' + units;
            $.ajax({
                    url: weatherApiUrl,
                    type: 'GET'
                })
                .done(function (weatherData) {
                    spinner.stop();

                    console.log(weatherData);

                    var tempObj = {};
                    tempObj.c = weatherData.main.temp;
                    tempObj.f = convertCToF(tempObj.c);
                    tempObj.c = Math.round(tempObj.c);
                    tempObj.f = Math.round(tempObj.f);
                    tempObj.currentUnit = "c";

                    showDateAndTime();

                    showIcon(weatherData.weather[0].main);

                    showTemperature(tempObj.c);

                    showLocation(locationData.city, locationData.country);

                    showOthers(weatherData.main.humidity, weatherData.wind.speed, weatherData.visibility);

                    $(".row").show();

                    setInterval(showDateAndTime, 1000);

                    $("#cel").click(function () {
                        if (tempObj.currentUnit === "f") {
                            showTemperature(tempObj.c);
                            tempObj.currentUnit = "c";
                        }
                    });

                    $("#fah").click(function () {
                        if (tempObj.currentUnit === "c") {
                            showTemperature(tempObj.f);
                            tempObj.currentUnit = "f";
                        }
                    });
                })
                .fail(function (xhr, status, errorThrown) {
                    alert("Sorry, there is some problem!");
                    spinner.stop();
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                    $(".weather-card").html("<h3>Some error occured!</h3>");
                });
        })
        .fail(function (xhr, status, errorThrown) {
            alert("Location unavailable!");
            spinner.stop();
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
            $(".weather-card").html("<h3>Some error occured!</h3>");
        });
});

function showDateAndTime() {
    var now = moment(Date.now());
    var day = now.format("dddd, MMMM Do");
    var time = now.format("h:mm A");
    $(".day").text(day);
    $(".time").text(time);
}

function showIcon(weather) {
    if (weather === "Thunderstorm" || weather === "Extreme") {
        var thunderstrom = '<div class="cloud"></div>\
                            <div class="lightning">\
                                <div class="bolt"></div>\
                                <div class="bolt"></div>\
                            </div>';
        $(".icon").html(thunderstorm);
    } else if (weather === "Drizzle" || weather === "Rain") {
        var rainy = '<div class="cloud"></div>\
                     <div class="rain"></div>';
        $(".icon").html(rainy);
    } else if (weather === "Clear") {
        var sunny = '<div class="sun">\
                        <div class="rays"></div>\
                    </div>';
        $(".icon").html(sunny);
    } else if (weather === "Snow") {
        var snow = '<div class="cloud"></div>\
                    <div class="snow">\
                        <div class="flake"></div>\
                        <div class="flake"></div>\
                    </div>';
        $(".icon").html(snow);
    } else if (weather === "Clouds" || weather === "Atmosphere" || weather === "Additional") {
        var clouds = '<div class="cloud"></div>\
                      <div class="cloud"></div>';
        $(".icon").html(clouds);
    } else {
        //error
        $(".icon").text("icon unavailable!");
    }
}

function showTemperature(temp) {
    $(".temp").text(temp + '\u00b0');
}

function showLocation(city, country) {
    $(".location").contents().filter(function () {
        return this.nodeType === 3
    }).each(function () {
        $(this).remove();
    });
    $(".location").append(city + ', ' + country);
}

function showOthers(humidity, wind, visibility) {
    if (humidity) {
        humidity = Math.round(humidity) + '%';
    } else {
        humidity = "---";
    }
    if (wind) {
        wind = Math.round(wind) + 'm/s';
    } else {
        wind = "---";
    }
    if (visibility) {
        visibility = Math.round(visibility) + 'm';
    } else {
        visibility = "---";
    }
    $("#humidity").text(humidity);
    $("#wind").text(wind);
    $("#visibility").text(visibility);
}

function convertCToF(tempC) {
    return (9.0 * tempC) / 5 + 32;
}

function convertFToC(tempF) {
    return (5.0 * (tempF - 32)) / 9;
}

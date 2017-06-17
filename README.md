# local-weather-app
This is a simple project from [freeCodeCamp](https://www.freecodecamp.com/challenges/show-the-local-weather) for beginners. It displays the current weather at user's location.

### Usage
1. Clone the repository. 
2. Create an account [here](https://openweathermap.org/) and get your API key. 
3. Create a file under *js* folder and name it *config.js*. Copy the following snippet and paste it in *config.js*:
```
const config = {
    API_KEY: "<your API key>",
    BASE_URL: "http://api.openweathermap.org/data/2.5/weather?id=524901&APPID="
}
```
4. Put your API key in the above snippet and save the file.
5. Launch index.html in your browser.

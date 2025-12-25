# Final Project: Web Mini-Apps Collection

## Project Type
Solo project

## Description
This project is a collection of four interactive web mini-apps: Calculator, Stopwatch, Lyrics Finder, and Weather App. Each app is built using HTML, CSS, and JavaScript, providing a simple and engaging user experience. Lyrics Finder and Weather App utilize public APIs to fetch real-time data.

---

## Project Overview
- **Calculator**: Perform basic arithmetic operations with a clean UI.
- **Stopwatch**: Track elapsed time with start, stop, and reset features.
- **Lyrics Finder**: Search for song lyrics by artist and title using the Lyrics.ovh API.
- **Weather App**: Get current weather information for any city using the OpenWeatherMap API.

---

## Main Features
- Responsive and modern UI for all apps
- Real-time data fetching for Lyrics Finder and Weather App
- Error handling and user feedback
- Simple theme toggle (optional)

---

## APIs Used
### Lyrics.ovh API
- **Name**: Lyrics.ovh API
- **Base URL**: `https://api.lyrics.ovh/v1/`
- **Endpoints**:
  - `GET /v1/{artist}/{title}` — Get lyrics for a song by artist and title
- **Parameters**: `artist` (string), `title` (string)
- **Authentication**: None required

### OpenWeatherMap API
- **Name**: OpenWeatherMap API
- **Base URL**: `https://api.openweathermap.org/data/2.5/`
- **Endpoints**:
  - `GET /weather?q={city name}&appid={API key}` — Get current weather by city
- **Parameters**: `q` (city name), `appid` (API key)
- **Authentication**: API key required

---

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)

---

## Getting Started
### 1. Clone or Download the Repository
```sh
git clone <repository-url>
# or download the ZIP and extract it
```

### 2. Run the Project Locally
1. Open the `final-project-elec3` folder.
2. Open any subfolder (`calculator`, `stopwatch`, `lyrics-api`, `weather-api`).
3. Open the `index.html` file in your web browser.

---

## Credits & API Attribution
- **Lyrics.ovh API**: [https://lyrics.ovh/](https://lyrics.ovh/)
- **OpenWeatherMap API**: [https://openweathermap.org/api](https://openweathermap.org/api)

---

## Author
- Solo Project by [Aira Jane Queroda]

---

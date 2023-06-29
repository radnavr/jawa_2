import React, { createContext, useEffect, useRef, useState } from 'react';


export const AppContext = createContext();

export const ContextProvider = ({ children }) => {

  //GLOBAL
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('new-jawa')));//
  const [weatherData, setWeatherData] = useState([]);

  //MAIN VIEW
  const [mainPanelView, setMainPanelView] = useState(undefined);
  const [infoPanelView, setInfoPanelView] = useState('details');
  const [infoPanelTableData, setInfoPanelTableData] = useState({})
  
  //MENU
  const [menu, setMenu] = useState(false)
  const [deleteLocations, setDeleteLocations] = useState(false);
  const inputRef = useRef();
 
  //EFFECTS
  useEffect(() => {
    if (settings && settings.savedLocations.length > 0) {
      getData();
      setMainView();
    }
  }, [settings])

  useEffect(() => {
    if(weatherData && weatherData.length > 0) {
      populateInfoTable();
    }
  }, [weatherData])

  useEffect(() => {
    populateInfoTable();
  }, [infoPanelView])

  //FUNCTIONS
  async function getData() {
    let newData = []

    for (let location of settings.savedLocations) {
      const apiResponse = await fetch(`/.netlify/functions/getWeatherData?location=${location}`);
      newData = [...newData, await apiResponse.json()]
    }

    if (newData.length === settings.savedLocations.length) {

      for (let locationEntry of newData) {
        locationEntry.toDelete = false;
      }

      setWeatherData(newData)
    }
  }

  function setMainView()  {
    let toDisplay = null;
    const targetLocation = settings.savedLocations.indexOf(settings.onDisplay);

    if (settings.onDisplay === null) {
      toDisplay = 0;
      setMainPanelView(toDisplay);
      return;
    }
      
    if (targetLocation === -1) {
        toDisplay = 0
        setMainPanelView(toDisplay);
        return;
       }

    toDisplay = targetLocation;
    setMainPanelView(toDisplay);
  }

  function firstLettersCapital(string) {
    const arrayed = string.split(' ');

    for (let i = 0; i < arrayed.length; i++) {
        arrayed[i] = arrayed[i].charAt(0).toUpperCase() + arrayed[i].slice(1);    
    }

    const result = arrayed.join(' ');

    return result;
  }  

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = `${(hours <= 9) ? 0 : ''}${hours}:${(minutes <= 9) ? 0 : ''}${minutes}`;

    return currentTime
  }

  // --> INFO TABLE STUFF

  function time12hTo24h(time12h) {
    if (weatherData) {
    const [time, xM] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00'
    }

    if (xM === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`}
  }

  function getUvIndexAssessment() {
    const uvIndexNow = weatherData[mainPanelView]?.current.uv;
    const uvIndexToBe = weatherData[mainPanelView]?.forecast.forecastday[0].hour[getTimesToDispay()[1]].uv

    let uvIndexAssessment = '';
    let uvIndexProspect = '';

    if (uvIndexNow < 3) uvIndexAssessment = 'low';
    if (uvIndexNow < 6) uvIndexAssessment = 'moderate';
    if (uvIndexNow < 8) uvIndexAssessment = 'high';
    if (uvIndexNow < 11) uvIndexAssessment = 'very high';
    if (uvIndexNow >= 11) uvIndexAssessment = 'extreme';

    if (uvIndexNow === uvIndexToBe) uvIndexProspect = 'stable';
    if (uvIndexNow < uvIndexToBe) uvIndexProspect = 'raising';
    if (uvIndexNow > uvIndexToBe) uvIndexProspect = 'falling';
    
    if(uvIndexNow && uvIndexToBe) {
      return `${uvIndexAssessment}, ${uvIndexProspect}`;
    }
  }

  function getPressureAssessment() {
    if (weatherData.length) {
      
      const pressureNow = weatherData[mainPanelView] 
        ? weatherData[mainPanelView]?.current.pressure_mb
        : weatherData[0]?.current.pressure_mb;

      const pressureToBe = weatherData[mainPanelView]
        ? weatherData[mainPanelView]?.forecast.forecastday[0].hour[getTimesToDispay()[1]].pressure_mb
        : weatherData[0]?.forecast.forecastday[0].hour[getTimesToDispay()[1]].pressure_mb

      const pressureNowAssessment = getPressureEvaluation(pressureNow);
      const pressureToBeAssessment = getPressureEvaluation(pressureToBe);

      function getPressureEvaluation(mb) {
        if (mb < 960) return {assessment: 'very low', code: 1};;
        if (mb < 987) return {assessment: 'low', code: 2};
        if (mb < 1014) return {assessment: 'transitory', code: 3};
        if (mb < 1040) return {assessment: 'high', code: 4};
        if (mb >= 1040) return {assessment: 'very high', code: 5};
      }

      function getPressureProspectEvaluation() {
        if (pressureNowAssessment.code > pressureToBeAssessment.code) return 'falling';
        if (pressureNowAssessment.code < pressureToBeAssessment.code) return 'raising';

        if ((pressureNow - pressureToBe) > 9) return 'falling';
        if ((pressureToBe - pressureNow) > 9) return 'raising';
        if ((pressureNow - pressureToBe) < 9 || (pressureToBe - pressureNow) < 9) return 'stable';
      }

      return `${pressureNowAssessment.assessment}, ${getPressureProspectEvaluation()}`;
    }
  }

  function getRelevantAstroEvent() {
    const currentTime = getCurrentTime();

    const sunriseData = weatherData[mainPanelView]
      ? weatherData[mainPanelView]?.forecast.forecastday[0].astro.sunrise
      : weatherData[0]?.forecast.forecastday[0].astro.sunrise
    
    const sunsetData = weatherData[mainPanelView]
      ? weatherData[mainPanelView]?.forecast.forecastday[0].astro.sunset
      : weatherData[0]?.forecast.forecastday[0].astro.sunset


    const sunriseTime = time12hTo24h(sunriseData)
    const sunsetTime = time12hTo24h(sunsetData)
      
    if (currentTime >= sunriseTime && currentTime < sunsetTime) {
        return 'sunset'
    }

    if (currentTime > sunsetTime || currentTime < sunriseTime) {
        return 'sunrise'
    }
  }

  function getAstroEventTime() {

    if (getRelevantAstroEvent() === 'sunrise') {
      return time12hTo24h(weatherData[mainPanelView]?.forecast.forecastday[0].astro.sunrise)
    }

    if (getRelevantAstroEvent() === 'sunset') {
      return time12hTo24h(weatherData[mainPanelView]?.forecast.forecastday[0].astro.sunset)
    }
  }

  function getTimesToDispay() {
    const currentTime = getCurrentTime();
    const currentHourAsNumber = parseInt([...currentTime][0]+[...currentTime][1])
    const timesToDisplay = [];

    for (let i = 1; i <= 3; i++) {
        let hourToDisplay = currentHourAsNumber + (i * 3)
        if (hourToDisplay >= 24) {
            hourToDisplay = hourToDisplay - 24;
        }
        const singleTimeToDisplay = `${(hourToDisplay <= 9) ? 0 : ''}${hourToDisplay}:00`;
        timesToDisplay.push(singleTimeToDisplay);
        timesToDisplay.push(hourToDisplay); 
    }

    return timesToDisplay
  }

  function getDayNamesToDispay() {

    const today = new Date().getDay();
    const nextTwoDays = [];

    function asignDayName(dayCode) {
        if (dayCode > 6) dayCode = dayCode - 7;
        if (dayCode === 0) return 'sunday';
        if (dayCode === 1) return 'monday';
        if (dayCode === 2) return 'tuesday';
        if (dayCode === 3) return 'wednesday';
        if (dayCode === 4) return 'thursday';
        if (dayCode === 5) return 'friday';
        if (dayCode === 6) return 'saturday';
    }

    for (let i = 1; i <=2; i++) {
      nextTwoDays.push(asignDayName(today + i));
    }

    return nextTwoDays;
}

  function populateInfoTable() {

    if(infoPanelView === 'details' ) {
      setInfoPanelTableData(current => {
        return {
          ...current, 
          keyOne: (weatherData[mainPanelView]?.forecast) && getRelevantAstroEvent(),
          valueOne: (weatherData[mainPanelView]?.forecast) && getAstroEventTime(),
          keyTwo: 'pressure',
          valueTwo: getPressureAssessment(),
          keyThree: 'UV index',
          valueThree: getUvIndexAssessment()
        }
      })
    }

    if(infoPanelView === 'hours') {
      setInfoPanelTableData(current => {
        return {
          ...current, 
          keyOne: getTimesToDispay()[0],
          valueOne: `${Math.round(weatherData[mainPanelView]?.forecast.forecastday[0].hour[getTimesToDispay()[1]].temp_c)}°`,
          keyTwo: getTimesToDispay()[2],
          valueTwo: `${Math.round(weatherData[mainPanelView]?.forecast.forecastday[0].hour[getTimesToDispay()[3]].temp_c)}°`,
          keyThree: getTimesToDispay()[4],
          valueThree: `${Math.round(weatherData[mainPanelView]?.forecast.forecastday[0].hour[getTimesToDispay()[5]].temp_c)}°`,
        }
      })
    }

    if(infoPanelView === 'days') {
      setInfoPanelTableData(current => {
        return {
          ...current, 
          keyOne: 'today',
          valueOne: `${Math.round(weatherData[mainPanelView]?.forecast.forecastday[0].day.mintemp_c)}° to 
          ${Math.round(weatherData[mainPanelView]?.forecast.forecastday[0].day.maxtemp_c)}°`,
          keyTwo: getDayNamesToDispay()[0],
          valueTwo: `${Math.round(weatherData[mainPanelView]?.forecast.forecastday[1].day.mintemp_c)}° to 
          ${Math.round(weatherData[mainPanelView]?.forecast.forecastday[1].day.maxtemp_c)}°`,
          keyThree: getDayNamesToDispay()[1],
          valueThree: `${Math.round(weatherData[mainPanelView]?.forecast.forecastday[2].day.mintemp_c)}° to 
          ${Math.round(weatherData[mainPanelView]?.forecast.forecastday[2].day.maxtemp_c)}°`,
        }
      })
    }   

  }

  return (
    <AppContext.Provider value={
      {
        deleteLocations, 
        setDeleteLocations,
        firstLettersCapital, 
        getCurrentTime, 
        getRelevantAstroEvent,
        infoPanelTableData,
        infoPanelView, 
        setInfoPanelView,
        inputRef,
        mainPanelView,
        setMainPanelView,
        menu, 
        setMenu, 
        weatherData,
        setWeatherData,
        settings,
        setSettings,
      }
    } >
        { children }
    </AppContext.Provider>
  )
}
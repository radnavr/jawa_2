import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { 
    WiDayCloudy, WiDayRain, WiDaySnow, WiDaySnowThunderstorm, WiDaySunny, 
    WiFog, WiNightCloudy, WiNightRain, WiNightSnow, WiNightSnowThunderstorm, 
    WiRain, WiSnow, WiThunderstorm
} from "react-icons/wi";

const Icon = ({ iconSize, targetLocationIndex, weatherDataDirections }) => {
    const { weatherData, getRelevantAstroEvent } = useContext(AppContext);

    function getWeatherCode(directions) {
        if (directions[0] === 'current') {
            return weatherData[targetLocationIndex]?.current.condition.code
        } 

        if (directions[0] === 'forecast' && !directions[2]) {
            return weatherData[targetLocationIndex]?.forecast.forecastday[directions[1]].day.condition.code
        }
        
        if (directions[0] === 'forecast' && directions[2]){
            return weatherData[targetLocationIndex]?.forecast.forecastday[0].hour[directions[2]].condition.code
        } 
    }

    const weatherCode = getWeatherCode(weatherDataDirections);

    function getIcon(code) {
        if (code === 1000) return <WiDaySunny size={iconSize}/>

        if (code === 1003 || code === 1009) {
            if (getRelevantAstroEvent() === 'sunset') {
                return <WiDayCloudy size={iconSize}/>
            }
            if (getRelevantAstroEvent() === 'sunrise') {
                return <WiNightCloudy size={iconSize}/>
            }
        }

        if (code === 1063 || code === 1150 || code === 1175 || code === 1180) {
            if (getRelevantAstroEvent() === 'sunset') {
                return <WiDayRain size={iconSize}/>
            }
            if (getRelevantAstroEvent() === 'sunrise') {
                return <WiNightRain size={iconSize}/>
            }           
        }

        if (code === 1006 || code === 1069 || code === 1072 || code === 1210 || code === 1216) {
            if (getRelevantAstroEvent() === 'sunset') {
                return <WiDaySnow size={iconSize}/>
            }
            if (getRelevantAstroEvent() === 'sunrise') {
                return <WiNightSnow size={iconSize}/>
            }   
        }

        if (code === 1130 || code === 1135 || code === 1147) return <WiFog size={iconSize}/>

        if (code === 1153 || 
            code === 1168 || 
            code === 1183 || 
            code === 1186 || 
            code === 1189 || 
            code === 1192 || 
            code === 1195 || 
            code === 1198 || 
            code === 1201 || 
            code === 1204 ||
            code === 1207 ||
            code === 1240 ||
            code === 1243 ||
            code === 1246 ||
            code === 1249 ||
            code === 1252) {
                return <WiRain size={iconSize}/>
            }
        
        if (code === 1213 ||
            code === 1216 ||
            code === 1219 ||
            code === 1222 ||
            code === 1225 ||
            code === 1237 ||
            code === 1255 ||
            code === 1258 ||
            code === 1261 ||
            code === 1264) {
                return <WiSnow size={iconSize}/>
            }
        
        if (code === 1273 || code === 1276) return <WiThunderstorm size={iconSize}/>

        if (code === 1279 || code === 1282) {
            if (getRelevantAstroEvent() === 'sunset') {
                return <WiDaySnowThunderstorm size={iconSize}/>
            }
            if (getRelevantAstroEvent() === 'sunrise') {
                return <WiNightSnowThunderstorm size={iconSize}/>
            }
        }    
    }

    return (
        <div>
            {getIcon(weatherCode)}
        </div>
    )
}

export default Icon
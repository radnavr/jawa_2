import React, { useContext } from 'react'
import { AppContext } from '../AppContext';
import MenuLauncher from './MenuLauncher';
import Icon from './Icon';

const MainPanel = () => {
    const {getCurrentTime, mainPanelView, weatherData } = useContext(AppContext)

  return (
    <div className='main-panel'>
        <h2 className='main-view-text text-l'>{getCurrentTime()}</h2>
        <h2 className='main-view-text text-m'>
        {weatherData[mainPanelView]?.location.region}
        </h2>
        <h1 className='main-view-text text-xl uppercase'>
        {weatherData[mainPanelView]?.location.name}
        </h1>
        <div className='flex-row justify-center align-itm-center'>
        <Icon 
            iconSize={90}
            targetLocationIndex={mainPanelView}
            weatherDataDirections={['current']}
        />
        <h2 className='main-view-text text-xl'>
            {(weatherData && weatherData.length > 0) 
            && Math.round(weatherData[mainPanelView]?.current.temp_c)
            }
            {(weatherData && weatherData.length > 0)
            && '°'
            }
        </h2>
        </div>
        <h3 className='main-view-text text-m'>
        {(weatherData && weatherData.length > 0)
            && 'feels like ' 
        }
        {(weatherData && weatherData.length > 0) 
        && Math.round(weatherData[mainPanelView]?.current.feelslike_c)
        }
        {(weatherData && weatherData.length > 0)
            && '°'
        }
        </h3>   
  </div>
  )
}

export default MainPanel
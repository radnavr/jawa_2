import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../AppContext'

const RadioButton = ({ target }) => {

  const { weatherData, setWeatherData } = useContext(AppContext)
  const [isActive, setIsActive] = useState(false)
  const button = { target }

  useEffect(() => {  
    let newData = weatherData;

    for (let item of newData) {
      if (item.location.name === button.target) {
        item.toDelete = isActive;
      }
    }

    setWeatherData(newData);
  }, [isActive])

  return (
    <div 
        className='radio-btn pointer'
        onClick={() =>setIsActive(!isActive)}
    >
        {isActive &&
        <div className='radio-btn-charge'></div>
        }
    </div>
  )
}

export default RadioButton
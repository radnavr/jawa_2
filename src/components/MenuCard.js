import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import Icon from './Icon';
import RadioButton from './RadioButton';

const MenuCard = ({id, location, region, targetLocationIndex, temperature}) => {

  const {firstLettersCapital, deleteLocations, settings, setSettings} = useContext(AppContext);

  function limitNameLength(name) {
    if (name.length > 20) {
        return `${name.substring(0, 18)}...`;
    }
    return name;
  }

  function setOnDisplay() {
    if (deleteLocations === false) {
      const newSettings = {...settings, onDisplay: firstLettersCapital(id)};
      localStorage.setItem('new-jawa', JSON.stringify(newSettings));
      setSettings(newSettings);
    }
  }

  return (
    <div 
      className={deleteLocations ? 'menu-card cursor-default' : 'menu-card pointer'}
      onClick={() => setOnDisplay()}
    >
      <div className='flex-row align-itm-center marg-l-s'>
        {deleteLocations && <RadioButton target={location}/>}
        <div className='flex-column justify-evenly'>
            <p className='text-m uppercase'>{location}</p>
            <p className='text-s'>{limitNameLength(region)}</p>
        </div>
      </div>
      <div className='flex-row align-itm-center marg-r-s'>
          <Icon  
            iconSize={50}
            targetLocationIndex={targetLocationIndex}
            weatherDataDirections={['current']}
          />
          <p className='text-l'>{Math.round(temperature)}°</p>
      </div>
    </div>
  )
}

export default MenuCard
import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import { MdClose } from 'react-icons/md';

import MenuCard from './MenuCard';

const Menu = () => {

  const {
    menu, 
    setMenu, 
    deleteLocations, 
    setDeleteLocations,
    settings,
    setSettings,
    weatherData, 
    setWeatherData, 
    firstLettersCapital, 
    inputRef
  } = useContext(AppContext);

  const [searchPhrase, setSearchPhrase] = useState('');
  function handleSearchPhraseChange(e) {
    setSearchPhrase(e.target.value);
  }

  const [inputError, setInputError] = useState(false);
  function handleInputError() {
    setInputError(true);
    setTimeout(() => {
      setInputError(false);
    }, 1000)
  }

  async function addNewLocation() {
    let storageContent = JSON.parse(localStorage.getItem('new-jawa'));

    if (storageContent === null) {
      const launchSettings = {
        savedLocations: [],
        onDisplay: null
      }
      storageContent = launchSettings;
    }

    if (searchPhrase === '' || storageContent.savedLocations.includes(firstLettersCapital(searchPhrase))) {
      setSearchPhrase('');
      handleInputError();

      return;
    }
    
    async function searchPhraseLegit() {
      const response = await fetch(`/.netlify/functions/getWeatherData?location=${searchPhrase}`);
      const result = response.status === 200;

      return result;
    }

    if (await searchPhraseLegit() === false) {
      setSearchPhrase('');
      handleInputError();

      return;
    }  
    
    const newStorageContent = {...storageContent, savedLocations: [...storageContent.savedLocations, firstLettersCapital(searchPhrase)]}
    localStorage.setItem('new-jawa', JSON.stringify(newStorageContent));
    setSettings(newStorageContent);
    setSearchPhrase('');
  }
  
  function deleteSelectedLocations() {
    let newSavedLocations = [];
    let newOnDisplay = null;
    let newSettings = {};
    let newWeatherData = [];

    for (let locationEntry of weatherData) {
      
      if (locationEntry.toDelete && locationEntry.location.name === settings.onDisplay) {
        newOnDisplay = weatherData[0].location.name;
      }

      if (!locationEntry.toDelete) {
        newWeatherData.push(locationEntry);
        newSavedLocations.push(locationEntry.location.name)
      }
    }

    if (newOnDisplay !== null) {  
      newSettings = {...settings, savedLocations: newSavedLocations, onDisplay: newOnDisplay}; 
    } else {
      newSettings = {...settings, savedLocations: newSavedLocations}
    }
  
    setSettings(newSettings);
    localStorage.setItem('new-jawa', JSON.stringify(newSettings))
    setWeatherData(newWeatherData);
    setDeleteLocations(false);
  }
  
  return (
    <div className={menu ? 'menu menu--opened' : 'menu'}>
      <div className='menu-bar fl-row justify-fl-end align-itm-center'>
        <MdClose 
          className='marg-r-s pointer'
          onClick={() => setMenu(!menu)}
          size={30}
        />
      </div>
      <div className='menu-bar fl-row justify-center align-itm-center'>
        {deleteLocations
          ? <div className='menu-container'>
              <span className='text-m uppercase'>delete locations</span>
              <button 
                className='btn-s pointer' 
                onClick={() => setDeleteLocations(!deleteLocations)}
              >cancel</button>
            </div>
          : <div className='menu-container'>
              <span className='text-m uppercase'>your locations</span>
              <button 
                className='btn-s pointer' 
                onClick={() => setDeleteLocations(!deleteLocations)}
              >manage</button>
            </div>
        }
      </div>
           
      <div className='x fl-column align-itm-center'>
        {
          weatherData.map(locationDataSet => 
            <MenuCard
              id = {locationDataSet.location.name}
              key = {locationDataSet.location.name}
              location = {locationDataSet.location.name}
              region = {locationDataSet.location.region}
              targetLocationIndex = {weatherData.indexOf(locationDataSet)}
              temperature = {locationDataSet.current.temp_c}
            />  
          )
        }
      </div>     
      
      <div className='bottom-bar menu-bar fl-row justify-center align-itm-center'>
        {deleteLocations
          ? <div>
              <button
                className='btn-l pointer'
                onClick={deleteSelectedLocations}
              >delete selected</button>
            </div>
          : <div className='menu-container'>
              <input
                id='addLocationInput' 
                onChange={handleSearchPhraseChange}
                ref={inputRef}
                value={searchPhrase}
              />
              <button
                className={inputError ? 'btn-s btn-red' : 'btn-s btn-black pointer'}
                onClick={addNewLocation}
              >add</button>
            </div>    
        }
      </div>

    </div>
  )
}

export default Menu
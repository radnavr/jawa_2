import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

import MenuLauncher from './MenuLauncher';
import MainPanel from './MainPanel';
import InfoPanel from './InfoPanel';
import Alert from './Alert';

const MainView = () => {

  const { settings } = useContext(AppContext)

  return (
    <div className='main-view'>

      {(settings && settings.savedLocations.length) 
        ?
        <>
          <MenuLauncher />
          <MainPanel />
          <InfoPanel />
        </> 
        :
          <Alert/>
      }
    
    </div>    
  )
}

export default MainView
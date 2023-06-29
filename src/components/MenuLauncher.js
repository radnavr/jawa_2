import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { MdEditLocation } from 'react-icons/md';

const MenuLauncher = () => {

    const { menu, setMenu } = useContext(AppContext)

  return (
    <div className='main-view-bar fl-row justify-fl-end align-itm-center'>
        <MdEditLocation 
          className='marg-r-s pointer'
          fill='#f7f7f7'
          onClick={() => setMenu(!menu)}
          size={30}
        />
  </div>
  )
}

export default MenuLauncher
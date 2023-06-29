import React, { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';

const Alert = () => {

    const { inputRef, menu, setMenu } = useContext(AppContext)

    useEffect(() => {
      if (menu) {
        inputRef.current.focus();
      }
    }, [menu])

  return (
    <div 
        className='alert pointer' 
        onClick={() => setMenu(!menu)}>
        <div>
            <p className='text-xl uppercase text-centered'>app not set</p>
            <p className='text-l text-centered'>tap  to save locations</p>
        </div>
    </div>
  )
}

export default Alert
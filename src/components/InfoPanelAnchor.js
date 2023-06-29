import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

const InfoPanelAnchor = (props) => {

    const {infoPanelView, setInfoPanelView} = useContext(AppContext)

  return (
    <div 
        className='info-panel-anchor'
        onClick={() => setInfoPanelView(props.target)}
    >
        <div className='flex-column justify-center'>
            <p className='text-m pointer'>{props.target}</p>
            <div 
                className={infoPanelView === props.target
                ? 'info-panel-underline w-100-per' 
                : 'info-panel-underline'
                }>
            </div>
        </div>
        <div className='expander'></div>
  </div>
  )
}

export default InfoPanelAnchor
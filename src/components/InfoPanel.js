import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import InfoPanelAnchor from './InfoPanelAnchor';
import Icon from './Icon';

const InfoPanel = () => {
    const {infoPanelTableData, infoPanelView, mainPanelView} = useContext(AppContext)
  return (
    <div className='info-panel'>      
        <div className='info-panel-controls'>
        <InfoPanelAnchor target='details' />
        <InfoPanelAnchor target='hours' />
        <InfoPanelAnchor target='days' />
        </div>
        <div className='info-panel-table'>
            <div className='info-panel-table-key text-m'>{infoPanelTableData.keyOne}</div>
            <div className='info-panel-table-value text-m'>
                <div 
                className={(infoPanelView === 'hours') ? 'hours-value-container'
                : (infoPanelView === 'days') ? 'days-value-container'
                : ''}
                >
                {infoPanelView === 'hours' &&
                    <Icon
                    iconSize={30}
                    targetLocationIndex={mainPanelView}
                    weatherDataDirections={['forecast', 0, parseInt(infoPanelTableData.keyTwo.split(':')[0])]} 
                    />
                }
                {infoPanelView === 'days' && 
                    <Icon
                    iconSize={30}
                    targetLocationIndex={mainPanelView}
                    weatherDataDirections={['forecast', 0]} 
                    />
                }
                {infoPanelTableData.valueOne}
                </div>
            </div>
            <div className='info-panel-table-key text-m'>{infoPanelTableData.keyTwo}</div>
            <div className='info-panel-table-value text-m'>
                <div 
                className={(infoPanelView === 'hours') ? 'hours-value-container'
                : (infoPanelView === 'days') ? 'days-value-container'
                : ''}
                >
                {infoPanelView === 'hours' &&
                    <Icon
                    iconSize={30}
                    targetLocationIndex={mainPanelView}
                    weatherDataDirections={['forecast', 0, parseInt(infoPanelTableData.keyTwo.split(':')[0])]} 
                    />
                }
                {infoPanelView === 'days' && 
                    <Icon
                    iconSize={30}
                    targetLocationIndex={mainPanelView}
                    weatherDataDirections={['forecast', 1]} 
                    />
                }
                {infoPanelTableData.valueTwo}
                </div>
            </div>
            <div className='info-panel-table-key text-m'>{infoPanelTableData.keyThree}</div>
            <div className='info-panel-table-value text-m'>
                <div 
                className={(infoPanelView === 'hours') ? 'hours-value-container'
                : (infoPanelView === 'days') ? 'days-value-container'
                : ''}
                >
                {infoPanelView === 'hours' &&
                    <Icon
                    iconSize={30}
                    targetLocationIndex={mainPanelView}
                    weatherDataDirections={['forecast', 0, parseInt(infoPanelTableData.keyTwo.split(':')[0])]} 
                    />
                }
                {infoPanelView === 'days' && 
                    <Icon
                    iconSize={30}
                    targetLocationIndex={mainPanelView}
                    weatherDataDirections={['forecast', 2]} 
                    />
                }
                {infoPanelTableData.valueThree}
                </div>
            </div>
        </div>
  </div>
  )
}

export default InfoPanel
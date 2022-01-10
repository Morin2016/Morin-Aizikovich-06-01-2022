import React, { useState } from 'react'
import moment from 'moment'
import api from '../../../apis'

import './style.css';

const Card = ({ minTemp, maxTemp, date, dayIcon, unit, wheatherText,
      favoriteName, minTempHidden }) => {

      let minTempConverted = minTemp
      let maxTempConverted = maxTemp
      let unitConverted = unit

      if (unitConverted === 'F') {
            minTempConverted = (((minTemp - 32) * 5 / 9).toFixed(0))
            maxTempConverted = (((maxTemp - 32) * 5 / 9).toFixed(0))
            unitConverted = 'C'
      }

      return (
            <div className='card'>
                  <div className='card-image'> {date ? moment(date).format("dddd") : ''} {favoriteName}</div>
                  <div className='card-temp-container'>
                        <p className='card-temp-val'>MAX:{maxTempConverted} {unitConverted}</p>
                        <p className={minTempHidden ? 'card-temp-hidden' : 'card-temp-val'}>MIN:{minTempConverted} {unitConverted}</p>
                  </div>
                  <img className='card-icon-forecast' src={api.getWeatherIcon(dayIcon)} />
                  <p>{wheatherText}</p>
            </div>
      )
}

export default Card
import React, { useState } from 'react'
import moment from 'moment'
import api from '../../../apis'

import './style.css';

const Card = ({ minTemp, maxTemp, date, dayIcon, unit, wheatherText,
      favoriteName, minTempHidden }) => {

      return (
            <div className='card'>
                  <div className='card-image'> {date ? moment(date).format("dddd") : ''} {favoriteName}</div>
                  <div className='card-temp-container'>
                        <p className='card-temp-val'>MAX:{maxTemp} {unit}</p>
                        <p className={minTempHidden ? 'card-temp-hidden' : 'card-temp-val'}>MIN:{minTemp} {unit}</p>
                  </div>
                  <img className='card-icon-forecast' src={api.getWeatherIcon(dayIcon)} />
                  <p>{wheatherText}</p>
            </div>
      )
}

export default Card
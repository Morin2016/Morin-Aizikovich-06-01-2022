import React from 'react'
import './style.css'

const Location = ({ name, maxTemp, unit }) => {

      let maxTempConverted = maxTemp
      let unitConverted = unit

      if (unitConverted === 'F') {
            maxTempConverted = (((maxTemp - 32) * 5 / 9).toFixed(0))
            unitConverted = 'C'
      }

      return (
            <div className='location'>
                  <h3>{name}</h3>
                  <h5>MAX: {maxTempConverted} {unitConverted}</h5>
            </div>
      )
}

export default Location
import React from 'react'
import './style.css'

const Location = ({ name, maxTemp, unit }) => {

      return (
            <div className='location'>
                  <h3>{name}</h3>
                  <h5>MAX: {maxTemp} {unit}</h5>
            </div>
      )
}

export default Location
import React from 'react'

const Button = ({ extraClass, handleOnClick, name, disabled }) => {
      return (
            <button
                  className={`dash-btn ${extraClass ? extraClass : ''}`}
                  onClick={handleOnClick}
                  disabled={disabled}
            >
                  {name}
            </button>
      )
}

export default Button


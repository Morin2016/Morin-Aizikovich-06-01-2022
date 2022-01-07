import React from 'react'
import { Link } from "react-router-dom"

import './style.css'

const Navbar = () => {
      return (
            <div className='navbar-wrapper' >
                  <header className='navbar-header-3d'>
                        <span>5-Coming Days Forecast</span>
                  </header>
                  <div className='navbar-links'>
                        <span><Link to="/">Home </Link></span>
                        <span><Link to="/favorites">Favorites</Link></span>
                  </div>
            </div>
      )
}

export default Navbar
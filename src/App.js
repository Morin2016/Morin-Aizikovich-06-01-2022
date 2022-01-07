import React from 'react'
import { Routes, Route } from "react-router-dom"
import Dashboard from './components/screens/Dashboard'
import Favorites from './components/screens/Favorites'
import Navbar from './components/common/Navbar'
import './App.css'

export default function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  )
}


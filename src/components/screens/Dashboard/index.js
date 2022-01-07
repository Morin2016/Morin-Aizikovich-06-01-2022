import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import api from '../../../apis'
import Card from '../../common/Card'
import Location from '../Dashboard/Location'
import Button from '../../common/Button'
import ToastNotify from '../../common/ToastNotify'
import { ON_GET_ERROR_MSG, ON_GET_SUCCESS_EMPTY_MSG, ON_INPUT_EMPTY, NOTIFICATION_TYPES } from '../../../utils'

import './style.css';

export default function Dashboard() {

      const inputRef = useRef(null)
      const [locationName, setLocationName] = useState('Tel-Aviv')
      const [locationKey, setLocationKey] = useState('215854')
      const [dailyForecasts, setDailyForecasts] = useState({ description: '', days: [] })
      const [currentWeather, setCurrentWeather] = useState({ city: '', maxTemp: '', unit: '' })
      const [isToggledFavorite, setToggledFavorite] = useState(false);
      const [loading, setLoading] = useState(true)
      const [disable, setDisable] = useState({
            favoriteBtn: false,
            cardWrapper: false
      })
      const [notify, setNotify] = useState({
            show: false,
            message: false,
            type: ''
      })
      const [favorites, setFavorites] = useState(
            JSON.parse(localStorage.getItem("favorites")) || [])

      useEffect(() => {
            setLoading(true)
            axios.get(api.getDefaultLocationForecast(locationKey))
                  .then(result => {
                        setDisableElements(false, false)
                        console.log(`SUCCESS AT GET DEFAULT LOCATION}`)
                        setLoading(false)
                        setTodaysWeather(result)
                        const data = result.data.DailyForecasts
                        const headline = result.data.Headline.Text
                        setDailyForecasts({ description: headline, days: data })
                  })
                  .catch((e) => {
                        setLoading(false)
                        setDisableElements(true, true)
                        showNotify(ON_GET_ERROR_MSG('default-location', e.message), NOTIFICATION_TYPES.error)
                        console.log(`ERROR AT GET DEFAULT LOCATION: ${e}`)
                  })

            toggleFavorite(locationKey)
            inputRef.current.focus()

      }, [])

      useEffect(() => {
            localStorage.setItem("favorites", JSON.stringify(favorites))
            toggleFavorite(locationKey)
      }, [favorites])

      const toggleFavorite = (key) => {
            if (favorites.some(item => item.id === key)) {
                  setToggledFavorite(true)
            }
            else (
                  setToggledFavorite(false)
            )
      }

      const createNewFavorite = () => {
            if (locationKey === '' || favorites.some(item => item.id === locationKey)) return

            let newFavorite = {
                  id: locationKey,
                  Name: locationName,
            }

            setFavorites(prevFavorites => [newFavorite, ...prevFavorites])
      }

      const removeFromFavorite = (key) => {
            setFavorites(favorites.filter(item => item.id !== key))
      }

      const setTodaysWeather = (result) => {
            if (!result) return

            setCurrentWeather({
                  maxTemp: result.data.DailyForecasts[0].Temperature.Maximum.Value,
                  city: locationName,
                  unit: result.data.DailyForecasts[0].Temperature.Minimum.Unit
            })
      }

      const showNotify = (msg, msgType) => {
            setNotify(oldData => {
                  return { ...oldData, show: true, message: msg, type: msgType }
            })
      }

      const setDisableElements = (isCardWrapperDisabled, isFavoBtnDisabled) => {
            setDisable(oldData => {
                  return { ...oldData, cardWrapper: isCardWrapperDisabled, favoriteBtn: isFavoBtnDisabled }
            })
      }

      const getForecastByLocation = (e) => {
            e.preventDefault()

            if (locationName === '' || (locationName.replace(/\s+/g, '') === '')) {
                  showNotify(ON_INPUT_EMPTY, NOTIFICATION_TYPES.warning)
                  return
            }

            setLoading(true)
            axios.get(api.getLocation(locationName))
                  .then(async data => {
                        if (data.data.length > 0) {
                              let entries = Object.entries(data)
                              let firstEntrieKey = entries[0][1][0].Key                            
                              toggleFavorite(firstEntrieKey)
                              try {
                                    const result = await axios.get(api.get5daysForecast(firstEntrieKey))
                                    console.log(`SUCCESS AT GET 5 SAYS FORECAST`)
                                    setDisableElements(false, false)
                                    setLoading(false)
                                    const data_1 = result.data.DailyForecasts
                                    const headline = result.data.Headline.Text
                                    setTodaysWeather(result)
                                    setDailyForecasts({ description: headline, days: data_1 })
                                    setLocationKey(firstEntrieKey)
                              } catch (e) {
                                    setLoading(false)
                                    setDisableElements(true, true)
                                    showNotify(ON_GET_ERROR_MSG(`data for ${locationName}`, e.message), NOTIFICATION_TYPES.error)
                                    console.log(`ERROR AT FETCH DATA FOR ${locationName}: ${e}`)
                              }
                        }
                        else {
                              setLoading(false)
                              showNotify(ON_GET_SUCCESS_EMPTY_MSG, NOTIFICATION_TYPES.warning)
                        }
                  })
                  .catch((e) => {
                        setLoading(false)
                        setNotify(oldData => {
                              return { ...oldData, show: true, message: ON_GET_ERROR_MSG(`data for ${locationName}`, e.message), type: NOTIFICATION_TYPES.error }
                        })
                        console.log(`ERROR AT FETCH DATA FOR ${locationName}: ${e}`)
                  })
      }

      const validateInputValue = (value) => {
            let validValue = value.replace(/[^A-Za-z\s]/ig, '')
            setLocationName(validValue)
      }

      return (
            <div>
                  <form className='dash-form-container' onSubmit={getForecastByLocation}>
                        <input
                              className='dash-form-input'
                              type="text"
                              placeholder="Search a city (only English letters allowed)..."
                              name="search"
                              value={locationName}
                              onChange={e => validateInputValue(e.target.value)}
                              ref={inputRef}
                              autoComplete='on'
                              required={true}
                        />
                        <Button
                              extraClass={`dash-form-btn`}
                              name='search'
                        />
                  </form>
                  {loading ?
                        <Loader
                              type='Circles'
                              color='#103055D9'
                              height={50}
                              width={50}
                              className='dash-loader'
                        /> : ''}
                  <div className={`dash-cards-wrapper ${disable.cardWrapper ? 'dash-cards-wrapper-disabled' : ''}`}>
                        <div className='dash-location-wrapper'>
                              <Location
                                    name={currentWeather.city}
                                    maxTemp={currentWeather.maxTemp}
                                    unit={currentWeather.unit}
                              />
                              <div>
                                    <Button
                                          extraClass={`dash-fav-btn ${isToggledFavorite ? 'dash-hidden' : ''}`}
                                          handleOnClick={() => createNewFavorite()}
                                          name='Add to Favorites'
                                          disabled={disable.favoriteBtn}

                                    />
                                    <Button
                                          extraClass={`dash-fav-btn ${!isToggledFavorite ? 'dash-hidden' : ''}`}
                                          handleOnClick={() => removeFromFavorite(locationKey)}
                                          name='Remove from Favorites'
                                          disabled={disable.favoriteBtn}

                                    />
                                    <img src={require('../../../assets/favorite-icon.icon')} className='dash-heart-icon' />
                              </div>
                        </div>
                        <div >
                              <h1 className='dash-description'>{dailyForecasts.description}</h1>
                              <section className='dash-cards-container'>
                                    {dailyForecasts !== undefined ? dailyForecasts.days.map((day, index) => {
                                          return (
                                                <Card
                                                      key={index}
                                                      date={day.Date}
                                                      maxTemp={day.Temperature.Maximum.Value}
                                                      minTemp={day.Temperature.Minimum.Value}
                                                      dayIcon={day.Day.Icon}
                                                      unit={day.Temperature.Minimum.Unit}
                                                />
                                          )
                                    }) : ''}
                              </section>
                              <ToastNotify
                                    message={notify.message}
                                    show={notify.show}
                                    setNotify={setNotify}
                                    type={notify.type}
                              />
                        </div>
                  </div>
            </div>
      )
}
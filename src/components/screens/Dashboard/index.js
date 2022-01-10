import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import debounce from 'lodash.debounce'

import api from '../../../apis'
import Card from '../../common/Card'
import Location from '../Dashboard/Location'
import Button from '../../common/Button'
import ToastNotify from '../../common/ToastNotify'
import { ON_GET_ERROR_MSG, ON_GET_SUCCESS_EMPTY_MSG, ON_INPUT_EMPTY, NOTIFICATION_TYPES } from '../../../utils'

import './style.css';

export default function Dashboard() {


      const inputRef = useRef(null)
      const [locationName, setLocationName] = useState('')
      const [locationKey, setLocationKey] = useState(api.DEFAULT_LOCATION_KEY)
      const [dailyForecasts, setDailyForecasts] = useState({ description: '', days: [] })
      const [currentWeather, setCurrentWeather] = useState({ city: '', maxTemp: '', unit: '' })
      const [isToggledFavorite, setToggledFavorite] = useState(false);
      const [loading, setLoading] = useState(true)
      const [suggestions, setSuggestions] = useState([])
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


      const inputValidation = (value) => {
            if (/[^A-Za-z\s]/ig.test(value)) {
                  showNotify(ON_INPUT_EMPTY, NOTIFICATION_TYPES.warning)
                  return
            }
            onChangeHandler(value)
      }

      const onChangeHandler = debounce((value) => {
            setLocationName(value)
      }, 1200)

      useEffect(() => {
            setLoading(true)
            axios.get(api.getDefaultLocationForecast(api.DEFAULT_LOCATION_KEY))
                  .then(result => {
                        setDisableElements(false, false)
                        console.log(`SUCCESS AT GET DEFAULT LOCATION`)
                        setLoading(false)
                        setTodaysWeather(result, api.DEFAULT_LOCATION_NAME)
                        setLocationName(api.DEFAULT_LOCATION_NAME)
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

      const setTodaysWeather = (result, city) => {
            if (!result) return

            setCurrentWeather({
                  maxTemp: result.data.DailyForecasts[0].Temperature.Maximum.Value,
                  city: city,
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

      let getSuggestions = (validValue) => {
            setLoading(true)
            setLocationName(validValue)
            axios.get(api.getLocation(validValue))
                  .then(async data => {
                        setLoading(false)

                        let matches = []
                        if (data.data.length > 0) {
                              data.data.map((place) => {
                                    matches.push({
                                          "key": place.Key,
                                          "city": place.LocalizedName,
                                          "country": place.Country.LocalizedName

                                    })
                              })
                        }
                        else {
                              setLoading(false)
                              showNotify(ON_GET_SUCCESS_EMPTY_MSG, NOTIFICATION_TYPES.warning)
                        }

                        setSuggestions(matches)
                  })
                  .catch((e) => {
                        setLoading(false)
                        setDisableElements(true, true)
                        showNotify(ON_GET_ERROR_MSG(`data for ${validValue}`, e.message), NOTIFICATION_TYPES.error)
                        console.log(`ERROR AT FETCH DATA FOR ${validValue}: ${e}`)
                  })
      }

      const onSelectedSuggestion = (city, key) => {
            setLocationName(city)
            setLocationKey(key)
            toggleFavorite(key)
            onSuggestHandler(city, key)
            inputRef.current.focus()
      }

      const showSeggestion = () => {
            if (inputRef?.current?.value === '') return
            else {
                  return (
                        <ul className='dash-ul'>
                              {suggestions && suggestions.map((option, index) => {
                                    return (
                                          <li
                                                className='dash-suggestion'
                                                key={index}
                                                onClick={() => onSelectedSuggestion(option.city, option.key)}

                                          >{option.city} - {option.country}</li>
                                    )
                              })}
                        </ul>
                  )
            }

      }

      const onSuggestHandler = async (city, key) => {
            try {
                  const result = await axios.get(api.get5daysForecast(key))
                  console.log(`SUCCESS AT GET 5 SAYS FORECAST`)
                  setDisableElements(false, false)
                  setLoading(false)
                  const daysData = result.data.DailyForecasts
                  const headline = result.data.Headline.Text
                  setTodaysWeather(result, city)
                  setDailyForecasts({ description: headline, days: daysData })
                  setSuggestions([])
                  inputRef.current.value = ''

            } catch (e) {
                  setLoading(false)
                  setDisableElements(true, true)
                  setSuggestions([])
                  showNotify(ON_GET_ERROR_MSG(`data for ${city}`, e.message), NOTIFICATION_TYPES.error)
                  console.log(`ERROR AT FETCH DATA FOR ${city}: ${e}`)
            }
      }

      useEffect(() => {
            if (locationName !== '') {
                  getSuggestions(locationName)
            }
      }, [locationName])

      return (
            <div >
                  <form className='dash-form-container' onSubmit={e => e.preventDefault()}>
                        <div>
                              <input
                                    id='inputid'
                                    className='dash-form-input'
                                    type="text"
                                    placeholder="Search a city (only English letters allowed)..."
                                    name="search"
                                    onChange={e => inputValidation(e.target.value)}
                                    ref={inputRef}
                                    required={true}
                                    autoComplete='off'
                              />
                              <Button
                                    extraClass={`dash-form-btn`}
                                    name='search'
                              />
                        </div>
                  </form>
                  <div className='dash-suggestion-container'>
                        {showSeggestion()}
                  </div>
                  {loading ?
                        <Loader
                              type='Circles'
                              color='#103055D9'
                              height={40}
                              width={40}
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
                                                      wheatherText={day.Day.IconPhrase}
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



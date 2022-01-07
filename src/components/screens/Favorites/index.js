import React, { useState, useEffect } from 'react'
import Loader from 'react-loader-spinner'
import axios from 'axios'

import ToastNotify from '../../common/ToastNotify'
import { ON_GET_FAVORITES_DATA_ERROR, NOTIFICATION_TYPES } from '../../../utils'
import Card from '../../common/Card'
import api from '../../../apis'

import './style.css'

const Favorites = () => {

      const favorites = JSON.parse(localStorage.getItem("favorites")) || []
      const [favoritesData, setFavoritesData] = useState([])
      const [loading, setLoading] = useState(false)

      const heartIcon = <img src={require('../../../assets/heart-exclamation.icon')} className='favor-heart-icon' />

      const [notify, setNotify] = useState({
            show: false,
            message: false,
            type: ''
      })

      useEffect(() => {
            fetchFavoriteData()
      }, [])

      async function fetchFavoriteData() {
            let temp = []
            if (favorites.length > 0) {
                  setLoading(true)
                  for await (let item of favorites) {
                        await axios.get(api.getCurrentCondition(item.id))
                              .then(result => {
                                    setLoading(false)
                                    temp.push([{ city: item.Name, data: result.data[0] }])
                              })
                              .catch((e) => {
                                    setLoading(false)
                                    setNotify(oldData => {
                                          return { ...oldData, show: true, message: ON_GET_FAVORITES_DATA_ERROR(`current-location`, e.message), type: NOTIFICATION_TYPES.error }
                                    })
                                    console.log(`ERROR AT GET CURRENT LOCATION: ${e}`)
                              })
                  }
                  setFavoritesData(temp)
            }
      }

      const showEmptyFavoritesMsg = (msg) => {
            return (
                  <h1 className='favo-empty-msg'> {heartIcon} {msg}
                        {heartIcon}
                  </h1>
            )
      }

      return (
            <div>
                  {favorites?.length === 0 ? showEmptyFavoritesMsg('Please navigate to home page and add your favorites locations') : showEmptyFavoritesMsg('Your favorites locations')}
                  <ToastNotify
                        message={notify.message}
                        show={notify.show}
                        setNotify={setNotify}
                        type={notify.type}
                  />
                  <section className='favo-form-container'>
                        {favoritesData !== undefined ? favoritesData.map(favoriteItem => {
                              return (
                                    <Card
                                          favoriteName={favoriteItem[0].city}
                                          maxTemp={favoriteItem[0].data?.Temperature?.Imperial?.Value}
                                          minTempHidden={true}
                                          unit={favoriteItem[0].data?.Temperature?.Imperial?.Unit}
                                          dayIcon={favoriteItem[0].data?.WeatherIcon}
                                          wheatherText={favoriteItem[0].data?.WeatherText}
                                    />
                              )
                        }) : ''}
                  </section>
                  {loading ?
                        <Loader
                              type='Circles'
                              color='#103055D9'
                              height={50}
                              width={50}
                              className='dash-loader'
                        /> : ''}
            </div>
      )
}

export default Favorites
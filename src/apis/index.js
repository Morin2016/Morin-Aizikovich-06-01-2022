const api = {}

const API_KEY = 'sIVFGsi6TxojqGiM8HGeZmqLa5ujUBzI'

const BASE_URL = 'https://dataservice.accuweather.com'

api.getLocation = (locationName) => {
      return `${BASE_URL}/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${locationName}`
}

api.getDefaultLocationForecast = (locationKey) => api.get5daysForecast(locationKey) //TEL_AVIV

api.getCurrentCondition = (locationKey)=>{
     return `${BASE_URL}/currentconditions/v1/${locationKey}?apikey=${API_KEY}`
}

api.get5daysForecast = (locationKey) => {
      return `${BASE_URL}/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}`
}

api.getWeatherIcon = (number) =>{
      return `https://www.accuweather.com/images/weathericons/${number}.svg`
}

export default api

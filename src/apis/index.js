const api = {}

const API_KEY = 'iGLoNvKabQs6r1z0dXbz7SPM5n1E3lgJ'
//const API_KEY = '26UTaXEdLvZtX90VWsOBSSrZzI8q5yQG'

const BASE_URL = 'https://dataservice.accuweather.com'

api.DEFAULT_LOCATION_NAME = 'Tel-Aviv'

api.DEFAULT_LOCATION_KEY = '215854'

api.getLocation = (locationName) => {
      return `${BASE_URL}/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${locationName}`
}

api.getDefaultLocationForecast = (locationKey) => api.get5daysForecast(locationKey) 

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

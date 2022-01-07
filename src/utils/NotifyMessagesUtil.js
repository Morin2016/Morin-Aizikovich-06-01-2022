export const ON_GET_ERROR_MSG = (requestName, e) => `A problem has been occurred 
while submitting your data. Error at: GET ${requestName}: ${e}`

export const ON_GET_SUCCESS_EMPTY_MSG = 'There is no information about locations matching the entered search text. Please try again.'

export const ON_INPUT_EMPTY = 'Location must be filled out!'

export const ON_GET_FAVORITES_DATA_ERROR = (requestName, e) => `A problem has been occurred! Please try again later. 
Error at: GET ${requestName}: ${e}.`

export const NOTIFICATION_TYPES = {
      error: 'error',
      warning: 'warning',
      info: 'info'
}

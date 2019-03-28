import errorCodes from './errors'
import constants from './constants'

module.exports = {
  sendError: (res, err, error_index, status_code) => {
    console.trace(err)
    if (typeof error_index === undefined) {
      status_code = constants.SERVER_ERROR
    }
    return res.status(status_code).json({
      code: errorCodes[error_index][0],
      message: errorCodes[error_index][1],
      success: false
    })
  },
  sendSuccess: (res, data) => {
    res.status(constants.OK).json({
      success: true,
      data
    })
  }
}

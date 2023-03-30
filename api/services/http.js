let request = require('request')
let moment = require('moment')

let func = {}

func.post = (url, headers, data) => {
  headers = headers || {}
  return new Promise((resolve, reject) => {
    headers['Content-type'] = 'application/json'
    let option = {
      method: 'POST',
      uri: url,
      headers,
      json: data,
      timeout: constant.REQUEST_TIMEOUT,
    }
    // log.logFile('restApi', 'post', 'Request...', option);
    console.log('http.request: ', option)
    request(option, (err, response, body) => {
      if (err) {
        return reject(err)
      }
      console.log('http.response: ', body, typeof body)
      // log.logFile('restApi', 'post', 'Response !!!', { option, body, err })
      try {
        // let body = JSON.parse(body.trim());
        resolve(body)
      } catch (err) {
        reject(err)
      }
    })
  })
}

func.get = (url, headers, params) => {
  headers = headers || {}
  let queryString = ''
  if (params) {
    queryString = '?'
    Object.keys(params).forEach((key) => {
      queryString += `${key}=${params[key]}&`
    })
  }
  return new Promise((resolve, reject) => {
    headers['Content-type'] = 'application/json'
    let option = {
      uri: url + queryString,
      headers,
      timeout: constant.REQUEST_TIMEOUT,
    }
    request(option, function (error, response, body) {
      if (error) return reject(err)
      try {
        body = JSON.parse(body)
        resolve(body)
      } catch (err) {
        reject(err)
      }
    })
  })
}

func.loyalty = async (url, dataToSend) => {
  const { LOYALTY_HOST, LOYALTY_COMPANY } = CConfig.get('INTEGRATION_CONFIG').subConfigs
  const { LOYALTY_API_KEY, LOYALTY_SECRET_KEY } = CConfig.get('API_KEY_CONFIG').subConfigs
  const link = LOYALTY_HOST.value + url
  const data = {
    company: LOYALTY_COMPANY.value,
    ...dataToSend
  }
  const headers = {
    apiKey: LOYALTY_API_KEY.value,
    appId: LOYALTY_SECRET_KEY.value,
    "accept-language": dataToSend.language,
  }
  const result = await http.get(link, headers, data)
  return result
}

module.exports = func

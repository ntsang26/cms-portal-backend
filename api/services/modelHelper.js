var CryptoJS = require('crypto-js')
var Crypto = require('crypto')
var moment = require('moment')

var func = {}

func.generateDigitCode = (length) => {
  length = Math.max(length, 6)
  let dateFactor = moment().diff(moment(new Date(2018, 0, 0, 0, 0, 0, 0)), 'milliseconds')
  let randomFator = ('000' + Math.round(Math.random() * 1000)).slice(-3)
  return ('000' + dateFactor).slice(-((length || 15) - 3)) + randomFator
}

func.generateDigitCodeBatch = function* (length, numOfCode) {
  ;(length = Math.max(length, 6)), (numOfCode = Math.min(numOfCode, 1000000))
  let dateFactor = moment().diff(moment(new Date(2018, 0, 0, 0, 0, 0, 0)), 'milliseconds')

  let suffixLen = ('' + (numOfCode - 1)).length
  let datePart = ('000' + dateFactor).slice(-((length || 15) - suffixLen)),
    count = 0
  while (count < numOfCode) {
    yield datePart + ('000000' + count++).slice(-suffixLen)
  }
}

func.getControllers = () => {
  let raw = sails.controllers
  let rs = []
  for (let ctrl in raw) {
    let controller = raw[ctrl]
    let item = {
      model: ctrl,
      actions: [],
    }
    for (var action in controller) {
      if (typeof controller[action] == 'function') {
        item.actions.push(action)
      }
    }
    if (item.actions.length > 0) rs.push(item)
  }
  return rs
}

func.filterSelectedFields = (obj, selectedFields) => {
  if (!selectedFields || !Array.isArray(selectedFields)) return obj

  let result = {}
  selectedFields.forEach((field) => {
    let nestedFields = typeof field === 'string' ? field.split('.') : ['sid']
    let target = result,
      source = obj
    while (nestedFields.length > 1) {
      let parentField = nestedFields.shift()
      source[parentField] = source[parentField] || {} //assign if existed
      source = source[parentField]
      target[parentField] = target[parentField] || {} //init if not existed
      target = target[parentField]
    }
    let leafField = nestedFields.shift()
    target[leafField] = source[leafField]
  })
  return result
}

func.normalizeString = (str) => {
  str = str.toLowerCase()
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  str = str.replace(/[đĐ]/g, 'd')
  str = str.replace(/([^0-9a-z-\s])/g, '')
  str = str.replace(/-+/g, '-')
  str = str.replace(/^-+|-+$/g, '')
  return str
}

func.validateParams = async (data, modelName, collection) => {
  let error = null
  let validData = {}
  const model = await SModel.findOne({ collection: modelName })
  const { attributes } = model
  for (const field in attributes) {
    const attribute = attributes[field]
    const { unique, isIn, required, type } = attribute

    if (!data[field] && required) {
      error = `${field} is required`
      break
    }

    if (typeof data[field] !== type && data[field] !== undefined) {
      error = `${field} is wrong type`
      break
    }

    if (isIn?.lenght && !isIn.include(data[field])) {
      error = `${field} is invalid`
      break
    }

    if (unique && field !== 'sid') {
      const filter = { [field]: { $eq: data[field] }, sid: { $ne: data.sid } }
      const record = await collection.find({}).filter(filter).limit(1).toArray()
      if (record.length) {
        error = `${field} is unique`
        break
      }
    }
    validData[field] = data[field]
  }
  return { errorMsg: error, validData }
}

func.calcDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // km (change this constant to get miles)
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

module.exports = func

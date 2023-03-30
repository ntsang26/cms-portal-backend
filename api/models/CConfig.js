/**
 * CErr.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  TOKEN_CONFIG: {
    TOKEN_EXPIRE: 24,
    EXPIRE_UNIT: 'hours',
    JWT_SECRET: 'nxjaskhkjdjlkhj',
  },
  BASIC_TOKEN: '944g9ce6-d335-11eb-b8bc-130003',
  OCR_CONFIG: {
    cornerUrl: 'file://api/services/ocr/models/corner/model.json',
    textUrl: 'file://api/services/ocr/models/text/model.json',
  },
  AMAZON_S3: {
    subConfigs: {
      ACCESS_KEY_ID_AMAZONE: {
        name: "Access Key",
        value: "EFEQH67S54KCPJZRLQMF",
        type: "string"
      },
      SECRET_ACCESS_KEY: {
        name: "Secret Access Key",
        value: "nssOUDF5KoYsDe859zhIaDbvoovzQNcdI+zXu5wm2cM",
        type: "string"
      },
      BUCKET_BATCH: {
        name: "Bucket batch",
        value: "funflow-sp/batch",
        type: "string"
      },
      BUCKET_NAME: {
        name: "Bucket Name",
        value: "funflow-sp/upload",
        type: "string"
      },
      LINK_STATIC: {
        name: "Link Static",
        value: "https://funflow-sp.sgp1.digitaloceanspaces.com/",
        type: "string"
      },
      BUCKET_DOWNLOAD: {
        name: "Bucket Download",
        value: "funflow-sp/download",
        type: "string"
      },
      DIGITAL_HOST: {
        name: "DIGITAL_HOST",
        value: "https://funflow-sp.sgp1.digitaloceanspaces.com/",
        type: "string"
      },
      BASE_HOST: {
        name: "BASE_HOST",
        value: "sgp1.digitaloceanspaces.com",
        type: "string"
      }
    }
  },
  AMAZON_PP_SMTP: {
    subConfigs: {
      SMTP_END_POINT: {
        name: 'smtpEndpoint',
        value: 'email-smtp.us-east-1.amazonaws.com',
        type: 'string'
      },
      SMTP_USERNAME: {
        name: 'smtpUsername',
        value: 'AKIAXCZBRFFAQDPR5W7Q',
        type: 'string'
      },
      SMTP_PASSWORD: {
        name: 'smtpEndpoint',
        value: 'BKHMUiZ9xK5Xd1VGXxqPwWzgt6pmzWZL',
        type: 'string'
      },
      SENDER_ADDRESS: {
        name: 'senderAddress',
        value: 'no-reply@momoney.com.mm',
        type: 'string'
      },
    }
  },
  attributes: {
    sid: { type: 'string', required: true, unique: true },
    key: { type: 'string', required: true, maxLength: 255 },
    type: { type: 'string', required: true },
    desc: { type: 'string', maxLength: 255 },
    name: { type: 'string', required: true },
    value: { type: 'string', defaultsTo: '' },
    subConfigs: { type: 'json', defaultsTo: {} }, //{scode: {name, value, type}}
    createdBy: { type: 'json' },
    updatedBy: { type: 'json' },
  },
  cache: {},

  get: (key) => {
    return CConfig.cache[key]
  },
  bootstrap: async () => {
    await refreshConfigs()
  },
}
let refreshConfigs = async () => {
  try {
    console.log('refresh configs √')
    let configs = await CConfig.find()
    configs.forEach((cnf) => {
      // if (cnf.value)
      //   cnf.value = castData(cnf.value, cnf.type);
      Object.keys(cnf.subConfigs).forEach((cnfCode) => {
        cnf.subConfigs[cnfCode].value = castData(
          cnf.subConfigs[cnfCode].value,
          cnf.subConfigs[cnfCode].type
        )
      })
      CConfig.cache[cnf.key] = cnf
    })
  } catch (err) {
    sails.log(err)
  }

  setTimeout(() => {
    refreshConfigs()
  }, 1000 * 60 * 1)
}

let castData = (value, type) => {
  try {
    switch (type) {
      case 'boolean':
        return value == 'true' || value == true || value === 1 ? true : false
      case 'number':
        return Number(value)
      case 'float':
      case 'double':
        return parseFloat(value)
      case 'integer':
        return parseInt(value)
      case 'array':
        return typeof value == 'string' ? JSON.parse(value) : Array.isArray(value) ? value : [value]
      default:
        return value
    }
  } catch (err) {
    return type !== 'array' ? value : [value]
  }
}

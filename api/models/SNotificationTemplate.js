/**
 * S_NotificationTemplateTemplate.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let request = require('request');

module.exports = {
  IDFORMAT: '0000000000',
  ACTION: {
    EARNPOINT: 'earnPoint',
    BUYVOUCHER: 'buyVoucher',
    NEWPROMOTION: 'newPromotion',
    APPLYVOUCHER: 'applyVoucher',
    TIERUPGRADE: 'tierUpgrade',
    VOUCHEREXPIREDSOON: 'voucherExpiredSoon',
    POINTEXPIREDSOON: 'pointExpiredSoon',
    NEW: 'new',

  },

  attributes: {
    sid: { type: 'string', required: true },
    name: { type: 'string', required: true },
    title: { type: 'json', required: true },
    body: { type: 'json', required: true },
    fullContent: { type: 'json', required: true },//content format html
    icon: { type: 'string', defaultsTo: '' },
    image: { type: 'string' },
    flag: { type: 'number', defaultsTo: 1, columnType: 'integer' },
    desc: { type: 'string', defaultsTo: '' },
    channel: { type: 'json', required: true, columnType: 'array' }, //isIn: ['sms', 'mail', 'push']},

    type: { type: 'string', isIn: ['auto', 'manual'], required: true },//
    createdBy: { type: 'json', required: true },
    updatedBy: { type: 'json' },
    action: { type: 'string' },
    //format: cmd:command_name/params
    // command_name: transfer/topup/profile/balance...
    // params: key1=value1&key2=value2...
    cmd: { type: 'json' },
    //cmd:{type:'request', action:'requestId'},
    ///type:enum:['request','none','transaction']
    ///action : enum:['requestId', 'transactionId']

    status: { type: 'string', isIn: ['created', 'sent'], defaultsTo: 'created' },
    company: { type: 'string' }
  },

  pushTransactionNotification: async (notificationConfig, transaction, inputData) => {
    let partner = inputData.dataObject.partner;
    let notificationTemplate = await S_NotificationTemplate.findOne({ sid: notificationConfig.template });
    if (!notificationTemplate) {
      return;
    }

    let notification = S_NotificationTemplate.fillDataToTemplate(notificationTemplate, transaction);

    let partnerConfig = inputData.dataObject.partnerConfig;// await D_CompanyConfig.findOne({company: partner.sid});
    let webhookUrl = partnerConfig.webhookUrl;


    let data = {
      channel: notification.channel.toString(),
      title: notification.title,
      content: notification.body,
      fullContent: notification.fullContent,
      icon: (notification.icon) ? C_Config.get('IMAGE').subConfigs.URL_S3.value + notification.icon : '',
      user: transaction[notificationConfig.target].refId,
      client: transaction[notificationConfig.target].client,
      cmd: notification.cmd
    }
    data.cmd = { action: notification.action }
    if (notification.action === S_NotificationTemplate.ACTION.BUYVOUCHER || notification.action === S_NotificationTemplate.ACTION.APPLYVOUCHER) {
      data.cmd.detail = transaction.voucherCode
    }
    if (notification.action === S_NotificationTemplate.ACTION.EARNPOINT) {
      data.cmd.detail = transaction.sid
    }
    if (notification.action === 'none') {
      data.cmd.detail = 'none'
    }
    //push result
    let option = {
      url: webhookUrl,
      form: data,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Language': constant.DEFAULT_LANGUAGE,
        Authorization: C_Config.get('DIGITAL_WALLET_CONFIG').subConfigs.API_KEY.value,
      },
    }

    let result = await doRequest(option)

    return true;
  },



  /**
   * @author TuyenNT
   * @editedBy  TuPT
   * @editedAt 18/06/2020
   */
  pushNotification: async (template, data, user, partner, cmd) => {
    log.logFile('pushNotification 0001', template);
    try {
      let notificationTemplate = await S_NotificationTemplate.findOne({ sid: template }), notification, objectData = {};
      if (!notificationTemplate) {
        return;
      }

      if (!Array.isArray(data)) notification = S_NotificationTemplate.fillDataToTemplate(notificationTemplate, data);

      let partnerConfig = await D_CompanyConfig.findOne({ company: partner.sid });
      let webhookUrl = partnerConfig.webhookUrl;

      for (let item of user.dataUsers) {

        if (cmd.action === S_NotificationTemplate.ACTION.VOUCHEREXPIREDSOON) {
          cmd.detail = item.voucherId
          objectData = {
            voucherId: item.voucherId,
            timeExpired: item.timeExpired,
            voucherName: item.voucherName
          }
        } else if (cmd.action === 'earnPointToNextTier')
          objectData = {
            point: item.point,
            nextTier: item.nextTier
          }
        else if (cmd.action === 'weeklyPointEarn')
          objectData = {
            point: item.point
          }
        else if (cmd.action === 'pointExpiredSoon')
          objectData = {
            point: item.point,
            expiredAt: item.expiredAt
          }
        else if (cmd.action === 'newPromotion') { }
        else {
          cmd.action = 'none'
          cmd.detail = 'none'
        }
        if (Array.isArray(data)) notification = S_NotificationTemplate.fillDataToTemplate(notificationTemplate, objectData);

        let dataToSend = {
          channel: notification.channel.toString(),
          title: notification.title,
          content: notification.body,
          fullContent: notification.fullContent,
          icon: (notification.icon) ? C_Config.get('IMAGE').subConfigs.URL_S3.value + notification.icon : '',
          user: item.refId,
          client: user.client, cmd,
          notificationId: notification.id
        }
        // console.log(dataToSend)
        let created = await S_NotificationHistory.createData({
          notificationId: template,
          notificationCode: await sails.helpers.common.randomNumber(10),
          channel: notification.channel,
          title: notification.name, user: item.refId,
          content: notification.body, client: user.client,
          fullContent: notification.fullContent, cmd, company: partner.sid,
          icon: (notification.icon) ? C_Config.get('IMAGE').subConfigs.URL_S3.value + notification.icon : ''
        })

        if (created && created.length > 0) {
          let option = {
            url: webhookUrl,
            form: dataToSend,
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept-Language': constant.DEFAULT_LANGUAGE,
              Authorization: C_Config.get('DIGITAL_WALLET_CONFIG').subConfigs.API_KEY.value,
            },
          }
          //push result
          let rs = await doRequest(option)
          // http.post(webhookUrl, { Authorization: C_Config.get('DIGITAL_WALLET_CONFIG').subConfigs.API_KEY.value }, dataToSend).then(rs => {
          if (rs && rs.err === 200) {
            S_NotificationHistory.update({ sid: created.map(i => i.sid) }, { status: S_NotificationHistory.STATUS.SUCCESS }).then(result => { }, error => { })
          } else {
            S_NotificationHistory.update({ sid: created.map(i => i.sid) }, { status: S_NotificationHistory.STATUS.FAILED }).then(result => { }, error => { })
          }

        }
      }

      return true;
    } catch (e) {
      return e.message
    }
  },

  /**
   * @author TuPT
   * @createdAt 09-03-2020
   * @param {*} opts
   * @editedAt 15/06/2020
   */
  pushTemplateToSingleUser: async function (opts) {
    try {
      let { templateId, user, data } = opts;

      let userId = ''
      let notification = await S_NotificationTemplate.findOne({ sid: templateId })
      if (!notification) return ({ status: 1, errorMsg: 'Missing notification config' });

      let languageDefault = await S_Language.findOne({ isDefault: true })
      if (!languageDefault) return ({ status: 1, errorMsg: 'Missing language default' });

      if (!notification.title[languageDefault.code] || !notification.body[languageDefault.code]
        || !notification.fullContent[languageDefault.code]) return ({ status: 1, errorMsg: 'Missing data notification' });

      try {
        if (data) {
          userId = user.id

          let dataCopied = Object.assign({}, data);
          flatFields(dataCopied, '', '', dataCopied);
          Object.keys(dataCopied).forEach(key => {
            let replaced = '{{' + key + '}}';
            var regExp = new RegExp(replaced, 'g');
            notification.body[languageDefault.code] = notification.body[languageDefault.code].replace(regExp, dataCopied[key]);
            // if (notification.fullContent) {
            notification.fullContent[languageDefault.code] = notification.fullContent[languageDefault.code].replace(regExp, dataCopied[key])
            // }
          })
        }
      } catch (err) {
        sails.log(err);
      }

      let created = await S_NotificationHistory.createData({
        notificationId: templateId,
        notificationCode: await sails.helpers.common.randomNumber(10),
        channel: notification.channel,
        title: notification.name, user: userId,
        content: notification.body,
        fullContent: notification.fullContent,
        company: notification.company
      })
      if (created && created.length > 0) {
        notification.id = created.id;
        let pushSingle = await S_NotificationTemplate.pushToSingleUser(notification, user, languageDefault)
        if (pushSingle) {
          S_NotificationHistory.update({ sid: created.map(i => i.sid) }, { status: S_NotificationHistory.STATUS.SUCCESS }).then(result => { }, error => { })
          return ({
            status: 0,
          })
        } else {
          S_NotificationHistory.update({ sid: created.map(i => i.sid) }, { status: S_NotificationHistory.STATUS.FAILED }).then(result => { }, error => { })
          return ({
            status: 1,
          })
        }
      }
    } catch (e) {
      console.log("error notification model: pushTemplateToSingleUser " + e.message)
    }
  },


  pushToSingleUser: async (notification, user, languageDefault) => {
    try {
      let result;
      let toAddresses = user.email
      let subject = notification.name
      let body = notification.body
      let template = notification.fullContent[languageDefault.code]
      // {
      //   toAddresses: user.email, subject: notification.name, body: notification.body, template: notification.fullContent
      // }
      if (notification.channel.indexOf('mail') !== -1) {
        result = await sails.helpers.common.sendAwsPinPointMail(toAddresses, subject, template)
      }

      return true;
    } catch (e) {
      console.log("error notification model: pushToSingleUser " + e.message)
    }
  },

  fillDataToTemplate: (template, data) => {
    let dataCopied = Object.assign({}, data);
    flatFields(dataCopied, '', '', dataCopied);
    // console.log('notibody', notification.body,' - flatted', dataCopied);
    Object.keys(dataCopied).forEach(key => {
      let replaced = '{{' + key + '}}';
      var regExp = new RegExp(replaced, 'g');
      Object.keys(template.body).forEach(item => {
        template.body[item] = template.body[item].replace(regExp, dataCopied[key]);
      })
      if (template.fullContent) {
        Object.keys(template.fullContent).forEach(i => {
          template.fullContent[i] = template.fullContent[i].replace(regExp, dataCopied[key]);
        })
      }
      if (template.title) {
        Object.keys(template.title).forEach(i => {
          template.title[i] = template.title[i].replace(regExp, dataCopied[key]);
        })
      }
    })

    return template;
  }

};


let flatFields = (data, fullKey, key, nested) => {
  fullKey = fullKey ? (fullKey + '.' + key) : key;
  if ((data !== nested && typeof nested !== "object") || !nested) {
    if (!data[fullKey]) data[fullKey] = nested;
    return;
  }

  Object.keys(nested).forEach(key => {
    flatFields(data, fullKey, key, nested[key]);
  })
}

doRequest = (option) => {
  option.timeout = C_Config.get('REQUEST_TIMEOUT').subConfigs.REQUEST_TIMEOUT.value
  return new Promise(function (resolve, reject) {
    request(option, function (err, res, body) {
      if (!err && res.statusCode == 200 && body) {
        resolve(JSON.parse(body));
      } else {
        log.logFile('restApi', 'doRequest', 'Response !!!', { option, body, err });
        reject(err);
      }
    });
  });
};
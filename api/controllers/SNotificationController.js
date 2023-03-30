/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var self = module.exports = {

  /**
   * @author TuPT
   * @createdAt 06-03-2020
   */
  createNtfTemplate: async (req, res) => {
    try {
      let { title, name, body, icon, flag, desc, channel, action, fullContent, image, type } = req.body;
      let { user } = req;
      let tempChannel = []
      if (!title || !body || !channel || !fullContent || !action || !name || typeof title !== 'object' || typeof body !== 'object'
        || typeof fullContent !== 'object' || Object.keys(title).length === 0 || Object.keys(body).length === 0 || Object.keys(fullContent).length === 0)
        return res.invalidParams();

      let checkDuplicate = await S_NotificationTemplate.find({ name }).limit(1)
      if (checkDuplicate && checkDuplicate.length !== 0) return res.json({ errorCode: 500, errorMsg: 'Duplicate Name!' })

      // try {
      //     channel = typeof channel === 'string' ? JSON.stringify(channel) : channel;
      //     if (_.includes(channel, 'push') && !flag)
      //         return res.status(500).json(sails.helpers.common.responseError(new Error(C_Error.INVALID_PARAMETER)));
      // } catch (err) {
      //     return res.status(500).json(sails.helpers.common.responseError({ errorCode: 500, errorMsg: err.message }));
      // }

      let valueToSet = {
        sid: sails.services.modelhelper.generateDigitCode(16),
        title, body: body, flag, action, fullContent, name,
        icon, desc, channel, type,
        createdBy: {
          id: user.id, name: user.name, role: user.role
        }, image,
        company: req.user.company,
      }

      Object.keys(valueToSet).forEach(key => {
        !valueToSet[key] && delete valueToSet[key]
      });

      await S_NotificationTemplate.create(valueToSet)
      return res.json(C_Error.SUCCESS)
    } catch (err) {
      log.logFile('NotificationController', 'create', err.stack)
      return res.serverError()
    }
  },

  updateNtfTemplate: async (req, res) => {
    try {
      let { id, title, name, body, icon, flag, desc, channel, action, fullContent, image, type } = req.body;
      let { user } = req;
      if (!id || !title || !body || !channel || !fullContent || !action || !name || typeof title !== 'object' || typeof body !== 'object'
        || typeof fullContent !== 'object' || Object.keys(title).length === 0 || Object.keys(body).length === 0 || Object.keys(fullContent).length === 0)
        return res.invalidParams();

      let ntfOld = await S_NotificationTemplate.find({ id }).limit(1)
      if (ntfOld && ntfOld.length == 0) return res.status(500).json({ errorMsg: 'not found' })

      let checkDuplicate = await S_NotificationTemplate.find({ id: { '!=': id }, name }).limit(1)
      if (checkDuplicate && checkDuplicate.length != 0) return res.serverError({ errorMsg: 'Duplicate Name' })

      // try {
      //     if (channel) channel = typeof channel === 'string' ? JSON.stringify(channel) : channel;
      //     if (_.includes(channel, 'push') && !flag)
      //        return res.status(500).json(sails.helpers.common.responseError(new Error(C_Error.INVALID_PARAMETER)));
      // } catch (err) {
      //    return res.status(500).json(sails.helpers.common.responseError(new Error(C_Error.INVALID_PARAMETER)));
      // }

      let valueToSet = {
        action, body: body, fullContent, channel, name, title, icon, desc, flag, type, image,
        updatedBy: {
          id: user.id, name: user.name, role: user.role
        }
      }

      Object.keys(valueToSet).forEach(key => {
        !valueToSet[key] && delete valueToSet[key]
      });

      await S_NotificationTemplate.update({ id }, valueToSet)
      return res.json(C_Error.SUCCESS)
    } catch (err) {
      log.logFile('NotificationController', 'update', err.stack)
      return res.serverError()
    }
  },

  listNotifTemplate: async (req, res) => {
    let templates = await NotificationTemplate.find({ skip: constant.SKIP, limit: constant.LIMIT })
    return res.json({
      errorCode: 0,
      data: templates
    })
  },

  /**
   * @author TuPT
   * @createdAt 17/06/2020
   */
  getNtfTemplate: async (req, res) => {
    try {
      let { select } = req.body;
      let query = {
        where: {},
        skip: constant.SKIP, limit: constant.LIMIT
      }
      if (select && select.length > 0) query.select = select

      let templates = await S_NotificationTemplate.find(query)
      return res.json({
        errorCode: C_Error.CODESUCCESS,
        data: templates
      })
    } catch (err) {
      log.logFile('NotificationController', 'getNtfTemplate', err.stack)
      return res.serverError()
    }
  },

  /**
   * @author TuPT
   * @createdAt 18/06/2020
   */
  pushNotification: async (req, res) => {
    try {
      let { templateId, client, dataUsers, action, idQuery } = req.body, dataFill, cmd = {};
      if (!req.company || !templateId || !client || !dataUsers || !action || dataUsers.length === 0) return res.invalidParams()

      if (action === S_NotificationTemplate.ACTION.NEWPROMOTION) {
        dataFill = await D_Promotion.findOne({ sid: idQuery })
        if (!dataFill) return res.status(404).json({ errorMsg: 'Promotion not found.' })
        cmd = {
          detail: idQuery,
          action: S_NotificationTemplate.ACTION.NEWPROMOTION
        }
      } else if (action === 'news') {
        dataFill = await D_News.findOne({ sid: idQuery })
        if (!dataFill) return res.status(404).json({ errorMsg: 'New not found.' })
        cmd = {
          detail: idQuery,
          action: 'news'
        }
      } else if (action === S_NotificationTemplate.ACTION.VOUCHEREXPIREDSOON) {
        dataFill = dataUsers
        cmd = {
          action: S_NotificationTemplate.ACTION.VOUCHEREXPIREDSOON
        }
      } else {
        dataFill = dataUsers
        cmd = {
          detail: 'none', action
        }
      }

      await S_NotificationTemplate.pushNotification(templateId, dataFill, { dataUsers, client }, { sid: req.company }, cmd, req.company)

      return res.json(C_Error.SUCCESS)
    } catch (err) {
      log.logFile('NotificationController', 'pushNotification', err.stack)
      return res.serverError()
    }
  },

  /**
   * @author TuPT
   * @createdAt 22/06/2020
   */
  detailNtfHistory: async (req, res) => {
    try {
      let { sid } = req.body;
      if (!sid || !req.company) return res.invalidParams()

      let data = await S_NotificationHistory.findOne({ sid, company: req.company })
      if (!data) return res.status(404).json({ errorMsg: 'Notification history not found.' })

      let user = await sails.models[constant.CLIENT_MAPPING[data.client]].find({ where: { refId: data.user }, select: ['name', 'refId'] })
      if (user && user.length > 0) data.user = user[0]

      return res.json({ errorCode: C_Error.CODESUCCESS, data })
    } catch (err) {
      log.logFile('NotificationController', 'detailNtfHistory', err.stack)
      return res.serverError()
    }
  }
};


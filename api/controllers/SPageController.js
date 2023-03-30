const moment = require('moment')

module.exports = {
  getMeta: async (req, res) => {
    try {
      const { client } = req.user
      const db = SPage.getDatastore().manager
      const SMenuCollection = db.collection('smenu')
      let sPages = []
      if (client === "admin") {
        sPages = await SPage.find({})
      } else sPages = await SPage.find({ client })
      const pageSid = [...sPages.map((page) => page.sid), "dashboard", "mediaManagement"]
      const sMenus = await SMenuCollection.find({
        page: {
          $in: pageSid
        }
      }).sort(['createdAt', -1]).toArray()
      return res.success({ sMenus, sPages })
    } catch (error) {
      console.log(error)
      res.serverError()
    }
  },
  getPage: async (req, res) => {
    try {
      const sid = req.param('page')
      const page = await SPage.findOne({ sid })
      if (!page) return res.error()
      return res.success(page)
    } catch (error) {
      console.log(error)
      res.serverError()
    }
  },
  getDynamicDataModel: async (req, res) => {
    try {
      let { pagination = {}, query, select = [] } = req.body
      let { current = 1, pageSize = 10, sort = "createdAt" } = pagination
      sort = { [sort]: 1 }
      const skip = pageSize * (current - 1)
      const model = req.param('model')
      const db = SPage.getDatastore().manager
      const rawCollection = db.collection(model)
      const projection = {}
      for (const item of select) {
        projection[item] = 1
      }
      query = !query || Object.keys(handleQuery(query)).length === 0 ? {} : handleQuery(query)
      const count = await rawCollection.count(query)

      if (!count) return res.success({ data: 0, count })

      const data = await rawCollection
        .find(query, projection)
        .sort(sort)
        .limit(pageSize)
        .skip(skip)
        .toArray()
      return res.success({
        data,
        count,
      })
    } catch (error) {
      console.log('getDynamicDataModel', error)
      res.serverError()
    }
  },
  createDynamicDataModel: async (req, res) => {
    try {
      let { context } = req.body
      const model = req.param('model')
      const db = SPage.getDatastore().manager
      const rawCollection = db.collection(model)
      context.sid = sails.services.modelhelper.generateDigitCode(16)
      context.createdAt = new Date()
      context.createdBy = req.user?.sid
      const { errorMsg, validData } = await sails.services.modelhelper.validateParams(
        context,
        model,
        rawCollection
      )
      if (errorMsg) return res.invalidParams({ errorMsg })
      const dataInserted = await rawCollection.insert(validData)
      return res.success({ data: dataInserted })
    } catch (error) {
      console.log(error)
      res.serverError()
    }
  },
  updateDynamicDataModel: async (req, res) => {
    try {
      let { context } = req.body
      if (!context.sid) res.invalidParams()
      const model = req.param('model')
      const db = SPage.getDatastore().manager
      context.createdAt = new Date(context.createdAt)
      context.updatedAt = new Date()
      context.updatedBy = req.user.sid
      const rawCollection = db.collection(model)
      const { errorMsg, validData } = await sails.services.modelhelper.validateParams(
        context,
        model,
        rawCollection
      )
      if (errorMsg) return res.invalidParams({ errorMsg })
      await rawCollection.update({ sid: validData.sid }, validData)
      return res.success()
    } catch (error) {
      console.log(error)
      res.serverError()
    }
  },
  deleteDynamicDataModel: async (req, res) => {
    try {
      const { sid } = req.body
      const model = req.param('model')
      if (!sid) res.invalidParams()
      const db = SPage.getDatastore().manager
      const rawCollection = db.collection(model)
      await rawCollection.remove({ sid })
      return res.success()
    } catch (error) {
      console.log(error)
      res.serverError()
    }
  },
}

const handleQuery = (query) => {
  const result = {}
  for (const key of Object.keys(query)) {
    const { operator, value } = query[key]
    if (value) {
      result[key] = {}
      const lsOperator = operator.split('/')
      if (lsOperator.length == 1) result[key][lsOperator[0]] = value
      if (lsOperator.length == 2) {
        result[key][lsOperator[0]] = {}
        result[key][lsOperator[0]][lsOperator[1]] = value
      }
    }
  }
  return result
}

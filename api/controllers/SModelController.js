module.exports = {
  createModel: async (req, res) => {
    try {
      const { name, collection, attributes } = req.body.context
      if (!name || !collection || !attributes) return res.invalidParams()
      const sid = sails.services.modelhelper.generateDigitCode(16)
      const db = SModel.getDatastore().manager
      const newModel = await SModel.create({ name, collection, attributes, sid }).fetch()
      await db.createCollection(newModel.collection)
      return res.success({ data: newModel })
    } catch (error) {
      console.log('createModel', error)
      res.serverError()
    }
  },
  deleteModel: async (req, res) => {
    try {
      const { sid } = req.body
      if (!sid) return res.invalidParams()
      const model = await SModel.findOne({ sid })
      const db = SModel.getDatastore().manager
      await SModel.destroy({ sid })
      await db.dropCollection(model.collection)
      return res.success()
    } catch (error) {
      console.log('createModel', error)
      res.serverError()
    }
  },
  updateModel: async (req, res) => {
    try {
      const { name, attributes, sid } = req.body.context
      if (!name || !attributes || !sid) return res.invalidParams()
      await SModel.update({ sid }).set({ name, attributes })
      return res.success()
    } catch (error) {
      console.log('createModel', error)
      res.serverError()
    }
  },
}

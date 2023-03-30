module.exports = {
  getAssets: async (req, res) => {
    try {
      let { pagination, query = {} } = req.body
      const { current = 1, pageSize = 10, sort = `createdAt DESC` } = pagination || {}
      const skip = pageSize * (current - 1)
      let assets = []
      const count = await DMedia.count(query)
      if (pagination) {
        assets = await DMedia.find(query)
          .limit(pageSize)
          .skip(skip)
          .sort(sort)
      } else {
        assets = await DMedia.find(query).sort(sort)
      }
      return res.success({ data: assets, count })
    } catch (error) {
      console.log('DMediaController', 'getAssets', error)
      return res.serverError()
    }
  },
  deleteAssets: async (req, res) => {
    try {
      let { id } = req.body
      let deleted = await DMedia.destroyOne({ sid: id })
      if (deleted) {
        return res.success({ errorCode: 0, message: "Deleted successfully!" })
      } else {
        return res.serverError()
      }
    } catch (error) {
      console.log('DMediaController', 'deleteAssets', error)
      return res.serverError()
    }
  },
  uploadAssets: async (req, res) => {
    try {
      console.log('START upload image')
      if (!req.files.image) return res.invalidParams()
      let result = await common.uploadImage(req.files.image)
      if (!result) return res.invalidParams()
      console.log('DONE upload image', result.data)
      const asset = await DMedia.create({
        url: result.data,
        sid: sails.services.modelhelper.generateDigitCode(16),
      }).fetch()
      return res.success({ link: asset.url })
    } catch (error) {
      console.log('DMediaController', 'uploadAssets', error)
      return res.serverError()
    }
  },
}

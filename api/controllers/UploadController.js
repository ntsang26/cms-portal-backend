/**
 * UploadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  uploadImage: async (req, res) => {
    try {
      console.log("START upload image")
      if (!req.files.image) return res.invalidParams()

      let result = await common.uploadImage(req.files.image)
      if (!result) return res.invalidParams()
      console.log("DONE upload image", result.data)
      return res.success({ link: result.data })
    } catch (error) {
      console.log(error)
      return res.serverError()
    }
  },

  // uploadFile: async (req, res) => {
  //     try {
  //         if (!req.files || !req.files.file) return res.invalidParams();

  //         let result = await common.uploadFile(req.files.file);
  //         if (result && result.errorCode)
  //             return res.serverError(result);

  //         return res.success({ data: result })
  //     } catch (error) {
  //         return res.serverError();
  //     }
  // },
}

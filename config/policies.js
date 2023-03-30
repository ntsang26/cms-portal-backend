module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  DUserController: {
    login: ['basicAuth'],
    getUser: ['bearer'],
    createUser: ['bearer'],
    updateUser: ['bearer'],
  },
  SPageController: {
    getMeta: ['bearer'],
    createDynamicDataModel: ['bearer'],
    updateDynamicDataModel: ['bearer'],
    deleteDynamicDataModel: ['bearer'],
  },
  SModelController: {
    createModel: ['bearer'],
    updateModel: ['bearer'],
    deleteModel: ['bearer'],
  },
  SNotificationController: {
    createNtfTemplate: ["bearer"],
    updateNtfTemplate: ["bearer"],
  },
  DMediaController: {
    getAssets: ['bearer'],
    uploadAssets: ['bearer'],
    deleteAssets: ['bearer'],
  },
  PublicController: {
    getPage: ['publicPage'],
    getPath: ['publicPage'],
    sendInfoSupport: ['publicPage']
  },
  IntegrationController: {
    loylatyPromotion: [],
    categoryPromotion: []
  }
}

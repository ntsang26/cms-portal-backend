module.exports.routes = {
  '/testservice': (req, res) => {
    return res.json('running')
  },

  '/': (req, res) => {
    return res.success({
      version: '2.0.0',
      env: process.env.NODE_ENV,
      changeLog: {},
    })
  },

  'GET /public/getPage/:path': {
    controller: 'PublicController',
    action: 'getPage',
  },

  'GET /public/getPath': {
    controller: 'PublicController',
    action: 'getPath',
  },

  'POST /public/sendInfoSupport': {
    controller: 'PublicController',
    action: 'sendInfoSupport',
  },

  'GET /integation/loylatyPromotion': {
    controller: 'IntegrationController',
    action: 'loylatyPromotion',
  },

  'GET /integation/loylatyCategory': {
    controller: 'IntegrationController',
    action: 'loylatyCategory',
  },

  'GET /integation/loylatyPromotionDetail': {
    controller: 'IntegrationController',
    action: 'loylatyPromotionDetail',
  },

  'GET /integation/loyaltyTier': {
    controller: 'IntegrationController',
    action: 'loyaltyTier',
  },

  'GET /integation/loyaltyPromotionNear': {
    controller: 'IntegrationController',
    action: 'loyaltyPromotionNear',
  },

  'POST /user/login': {
    controller: 'DUserController',
    action: 'login',
  },

  'POST /user/getUser': {
    controller: 'DUserController',
    action: 'getUser',
  },

  'POST /user/createUser': {
    controller: 'DUserController',
    action: 'createUser',
  },

  'POST /user/updateUser': {
    controller: 'DUserController',
    action: 'updateUser',
  },

  'POST /api/upload/uploadImage': {
    controller: 'UploadController',
    action: 'uploadImage',
  },

  'GET /page/getPage/:page': {
    controller: 'SPageController',
    action: 'getPage',
  },
  'POST /page/getMeta': {
    controller: 'SPageController',
    action: 'getMeta',
  },
  'POST /dynamic/dataModel/:model': {
    controller: 'SPageController',
    action: 'getDynamicDataModel',
  },
  'POST /dynamic/dataModel/create/:model': {
    controller: 'SPageController',
    action: 'createDynamicDataModel',
  },
  'POST /dynamic/dataModel/delete/:model': {
    controller: 'SPageController',
    action: 'deleteDynamicDataModel',
  },
  'POST /dynamic/dataModel/update/:model': {
    controller: 'SPageController',
    action: 'updateDynamicDataModel',
  },
  'POST /smodel/create': {
    controller: 'SModelController',
    action: 'createModel',
  },
  'POST /smodel/update': {
    controller: 'SModelController',
    action: 'updateModel',
  },
  'POST /smodel/delete': {
    controller: 'SModelController',
    action: 'deleteModel',
  },
  //media
  'POST /media/getAssets': {
    controller: 'DMediaController',
    action: 'getAssets',
  },
  'POST /media/deleteAssets': {
    controller: 'DMediaController',
    action: 'deleteAssets',
  },
  'POST /media/uploadAssets': {
    controller: 'DMediaController',
    action: 'uploadAssets',
  },
  "POST /notification/createNtfTemplate": {
    controller: "SNotificationController",
    action: "createNtfTemplate",
  },

  "POST /notification/updateNtfTemplate": {
    controller: "SNotificationController",
    action: "updateNtfTemplate",
  },
}

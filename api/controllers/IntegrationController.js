module.exports = {
    loylatyPromotion: async (req, res) => {
        try {
            const { limit = 10, skip = 0, language = "en", categoryId, search } = req.query
            const { LOYALTY_PROMOTION_URL } = CConfig.get('INTEGRATION_CONFIG').subConfigs
            const dataToSend = {
                language,
                limit,
                skip,
            }
            if (categoryId) dataToSend.categoryId = categoryId
            if (search) dataToSend.search = search
            const result = await http.loyalty(LOYALTY_PROMOTION_URL.value, dataToSend)
            if (result.errorCode) return res.serverError()
            res.success({ data: result.data })
        } catch (error) {
            console.log('loylatyPromotion', error?.toString())
            res.serverError()
        }
    },
    loylatyCategory: async (req, res) => {
        try {
            const { language = "en" } = req.query
            const { LOYALTY_CATEGORY_URL } = CConfig.get('INTEGRATION_CONFIG').subConfigs
            const dataToSend = { language }
            const result = await http.loyalty(LOYALTY_CATEGORY_URL.value, dataToSend)
            if (result.errorCode) return res.serverError()
            res.success({ data: result.data })
        } catch (error) {
            console.log('loylatyPromotion', error?.toString())
            res.serverError()
        }
    },
    loylatyPromotionDetail: async (req, res) => {
        try {
            const { promotionId, language = "en" } = req.query
            if (!promotionId) res.serverError()
            const { LOYALTY_PROMOTION_DETAIL_URL } = CConfig.get('INTEGRATION_CONFIG').subConfigs
            const dataToSend = { language, promotionId }
            const result = await http.loyalty(LOYALTY_PROMOTION_DETAIL_URL.value, dataToSend)
            if (result.errorCode) return res.serverError()
            res.success({ data: result.data })
        } catch (error) {
            console.log('loylatyPromotionDetail', error?.toString())
            res.serverError()
        }
    },
    loyaltyTier: async (req, res) => {
        try {
            const { language = "en" } = req.query
            const { LOYALTY_TIER_URL } = CConfig.get('INTEGRATION_CONFIG').subConfigs
            const dataToSend = { language }
            const result = await http.loyalty(LOYALTY_TIER_URL.value, dataToSend)
            if (result.errorCode) return res.serverError()
            res.success({ data: result.data })
        } catch (error) {
            console.log('loyaltyTier', error?.toString())
            res.serverError()
        }
    },
    loyaltyPromotionNear: async (req, res) => {
        try {
            const { language = "en", lat = 0, long = 0, skip = 0, limit = 10 } = req.query
            const LOYALTY_PROMOTION_NEAR_IMAGE_HOST = 'https://loyalty-poc-storage-s3.s3-ap-southeast-1.amazonaws.com/'
            const { LOYALTY_PROMOTION_NEAR_URL } = CConfig.get('INTEGRATION_CONFIG').subConfigs

            const dataToSend = {
                language,
                lat,
                long,
                skip,
                limit,
                distance: 50000
            }
            const result = await http.loyalty(LOYALTY_PROMOTION_NEAR_URL.value, dataToSend)
            if (result.errorCode) return res.serverError()
            for (const item of result.data) {
                let distance = sails.services.modelhelper.calcDistance(lat, long, item.latitude, item.longitude)
                if (distance > 1) item.distance = Number(distance).toFixed(2) + "km";
                else if (distance <= 1) item.distance = Math.floor(distance * 1000) + "m";
                item.promotion.image = LOYALTY_PROMOTION_NEAR_IMAGE_HOST + item.promotion.image
            }
            res.success({ data: result.data })
        } catch (error) {
            console.log('loyaltyTier', error?.toString())
            res.serverError()
        }
    }
}

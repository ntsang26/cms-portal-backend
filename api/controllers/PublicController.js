module.exports = {
    getPage: async (req, res) => {
        try {
            const path = req.param('path')
            const { language } = req.query
            const db = SPage.getDatastore().manager
            const rawCollection = db.collection('dpage')
            let pageInfo = []
            if (language) {
                pageInfo = await rawCollection
                    .find({})
                    .filter({
                        path,
                        language,
                        isPublic: true,
                    })
                    .limit(1)
                    .toArray()
            } else {
                pageInfo = await rawCollection
                    .find({})
                    .filter({
                        path,
                        isPublic: true,
                    })
                    .limit(1)
                    .toArray()
            }

            let data = pageInfo[0]
            if (data.footer) {
                const db = SPage.getDatastore().manager
                const DFooterCollection = db.collection('dfooter')
                const footer = await DFooterCollection.findOne({ sid: data.footer })
                data.footer = footer?.ui || null
            }
            const { html, css, js } = data.ui
            data.media = "https://mo.com.mm/wp-content/uploads/2022/10/cropped-mo_favicon_circle_512-180x180.png"
            data.ui = { html, css, js }
            return res.success({ data })
        } catch (error) {
            console.log(error)
            return res.serverError()
        }
    },
    getPath: async (req, res) => {
        try {
            const db = SPage.getDatastore().manager
            const rawCollection = db.collection('dpage')
            const lsPage = await rawCollection
                .find({})
                .filter({ isPublic: true })
                .project({ path: 1, language: 1, _id: 0 })
                .toArray()
            const data = lsPage.map((item) => {
                return {
                    path: item.path,
                    language: item.language
                }
            })
            return res.success({ data })
        } catch (error) {
            console.log(error)
            return res.serverError()
        }
    },
    sendInfoSupport: async (req, res) => {
        try {
            let { context } = req.body
            const model = "dsupport"
            const db = SPage.getDatastore().manager
            const rawCollection = db.collection(model)
            context.sid = sails.services.modelhelper.generateDigitCode(16)
            context.createdAt = new Date()
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
    }
}

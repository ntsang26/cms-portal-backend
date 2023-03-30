/**
 * Module dependencies
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
_ = require('@sailshq/lodash');
var formatUsageError = require('sails/lib/hooks/blueprints/formatUsageError.js');
const MAX_RECORDS = 100000;
const moment = require('moment');
/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findRecords(req, res) {
  var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;

  // Set the blueprint action for parseBlueprintOptions.
  req.options.blueprintAction = 'find';

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];
  // console.log(queryOptions.meta);
  // if (queryOptions.meta) {
  //   console.log(queryOptions.meta);
  //   queryOptions.meta.enableExperimentalDeepTargets = true;
  // }
  // console.log(queryOptions.criteria)

  // TUPT add 08/04/2020
  let query = actionUtil.parseCriteria(req)
  if (Model.attributes.company && req.user.client == constant.CLIENT.USER) {
    query = Object.assign({}, { company: req.user.company || '' })
  }
  // end
  if (Model.attributes.isDeleted) {
    query = Object.assign({}, { isDeleted: false })
  }

  // TuPT ADD 07/07/2020
  if (Object.keys(queryOptions.criteria.where).indexOf("createdAt") !== -1
    || Object.keys(queryOptions.criteria.where).indexOf("updatedAt") !== -1) {
    if (queryOptions.criteria.where.createdAt) {
      queryOptions.criteria.where.createdAt = {
        '>=': new Date(moment(queryOptions.criteria.where.createdAt['>=']).startOf('day')),
        '<=': queryOptions.criteria.where.createdAt['<='] ?
          new Date(moment(queryOptions.criteria.where.createdAt['<=']).endOf('day')) :
          new Date(moment(new Date()).endOf('day'))
      }
    }
    if (queryOptions.criteria.where.updatedAt) {
      queryOptions.criteria.where.updatedAt = {
        '>=': new Date(moment(queryOptions.criteria.where.updatedAt['>=']).startOf('day')),
        '<=': queryOptions.criteria.where.updatedAt['<='] ?
          new Date(moment(queryOptions.criteria.where.updatedAt['<=']).endOf('day')) :
          new Date(moment(new Date()).endOf('day'))
      }
    }
  }

  if (Model.tableName === 'd_transactionjournal') queryOptions.criteria.where.partnerId = req.user.company

  //anhnbt 21/1/2021 {
  query = Object.assign({}, query, queryOptions.criteria.where)
  if (Model.tableName === 'dofficer' && query.gender) {
    query.gender = query.gender.contains;
  }
  // }

  let countQuery = Model.count()
    .where(query).meta({ enableExperimentalDeepTargets: true });
  countQuery.exec(function f(err, count) {
    if (err) {
      return res.serverError(err);
    }

    if (req.apiInfo && req.apiInfo.downloadReport) {
      if (count > MAX_RECORDS) {
        return res.serverError({ code: 502, message: 'Record to max' });
      }
      delete queryOptions.criteria.skip;
      delete queryOptions.criteria.limit;
    }
    // TUPT add 08/04/2020
    if (Model.attributes.company && req.user.client == constant.CLIENT.USER) {
      queryOptions.criteria.where.company = req.user.company || ''
    }
    if (Model.attributes.isDeleted) {
      queryOptions.criteria.where.isDeleted = false
    }
    // end
    //anhnbt 21/1/2021 {
    if (Model.tableName === 'dofficer' && query.gender) {
      queryOptions.criteria.where.gender = query.gender
    }
    //anhnbt }
    Model
      .find(queryOptions.criteria, queryOptions.populates).meta(queryOptions.meta).meta({ enableExperimentalDeepTargets: true })
      .exec(function found(err, matchingRecords) {
        if (err) {
          // If this is a usage error coming back from Waterline,
          // (e.g. a bad criteria), then respond w/ a 400 status code.
          // Otherwise, it's something unexpected, so use 500.
          switch (err.name) {
            case 'UsageError':
              return res.badRequest(formatUsageError(err, req));
            default:
              return res.serverError(err);
          }
        } //-•

        //if report excel
        if (req.apiInfo && req.apiInfo.downloadReport) {
          switch (req.apiInfo.downloadReport) {
            case 'codeReport':
              return sails.helpers.report.reportCode(matchingRecords).then(bin => {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                res.end(bin, 'binary');
              });
            case 'userReport':
              return sails.helpers.report.reportUser(matchingRecords).then(bin => {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                res.end(bin, 'binary');
              });
            case 'voucherReport':
              return sails.helpers.report.reportVoucher(matchingRecords).then(bin => {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                res.end(bin, 'binary');
              });
              break;
          }
        }

        if (req._sails.hooks.pubsub && req.isSocket) {
          Model.subscribe(req, _.pluck(matchingRecords, Model.primaryKey));
          // Only `._watch()` for new instances of the model if
          // `autoWatch` is enabled.
          if (req.options.autoWatch) {
            Model._watch(req);
          }
          // Also subscribe to instances of all associated models
          _.each(matchingRecords, function (record) {
            actionUtil.subscribeDeep(req, record);
          });
        } //>-



        let retData = {
          data: matchingRecords,
          count
        }
        if (queryOptions.using === 'notice') {
          let updateId = [];
          matchingRecords.map(v => {
            if (!v.isRead) {
              updateId.push(v.id);
            }
          });
          if (updateId.length) {
            Model.update({ id: updateId }, { isRead: true }).exec(function f(err, record) {
              if (err) {
                return res.serverError(err);
              }
              let where = actionUtil.parseCriteria(req);
              where.isRead = false;
              Model.count().where(where).exec(function f(err, count) {
                if (err) {
                  return res.serverError(err);
                }
                retData.remainNotice = count;
                return res.success(retData);
              })
            });
          } else {
            let where = actionUtil.parseCriteria(req);
            where.isRead = false;
            Model.count().where(where).exec(function f(err, count) {
              if (err) {
                return res.serverError(err);
              }
              retData.remainNotice = count;
              return res.success(retData);
            })
          }
        } else {
          return res.success(retData);
        }
      }); //</ .find().exec() >
  });


};

/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
// const schedule = require('node-schedule');
module.exports.bootstrap = async function (cb) {

  for (let index in sails.models) {
    let model = sails.models[index];
    // console.log('model: ' + model.globalId, index);
    if (index != 'archive' && model.bootstrap) //https://sailsjs.com/documentation/reference/configuration/sails-config-models
      await model.bootstrap();
  }
  await mongoConnector.connect();
  // await eventStream.initEventQueue();

  // await setSchedule();
  // setInterval(() => {
  //   setSchedule();
  // }, 1000 * 60 * 10);

  cb();

  // eventStream.test();
};

// const setSchedule = async () => {
//   console.log(' load schedule √ ')
//   let listJob = await sails.config.cronjob.getListJob();
//   listJob.forEach(function (job) {
//     schedule.scheduleJob(job.interval, sails.config.cronjob[job.method]);
//   });
// }
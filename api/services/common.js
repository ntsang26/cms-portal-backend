var common = {}
const dirname = require('path').resolve(sails.config.appPath, 'assets/images')
const maxBytes = 1000000000
const uuid = require("uuid");


common.uploadImage = async (file, bucketName) => {
  try {
    if (file) {
      let s3bucket = await awsS3.initDigital();
      var params = {
        Bucket: bucketName
          ? bucketName
          : CConfig.AMAZON_S3.subConfigs.BUCKET_NAME.value,
        Key: `${file.name.split('.')[0]}_${uuid.v4()}${getExtension(
          file.name
        )}`,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
      let data = await s3bucket.upload(params).promise();
      return {
        data: CConfig.AMAZON_S3.subConfigs.LINK_STATIC.value + data.Key,
        all: data,
      };
    } else {
      console.log("NO IMAGE TO UPLOAD")
      return false;
    }
  } catch (err) {
    console.log(err)
    return false;
  }
};

common.uploadFile = (file, bucketName, fileName, binaryData, type) => {
  return new Promise(async (resolve, reject) => {
    if (file || binaryData) {
      let s3bucket = awsS3.initDigital();
      s3bucket.createBucket(function () {
        var params = {
          Bucket: bucketName
            ? bucketName
            : CConfig.AMAZON_S3.subConfigs.BUCKET_NAME.value,
          Key: fileName
            ? fileName
            : `${file.name.split('.')[0]}_${uuid.v4()}${getExtension(
              file.name
            )}`,
          Body: binaryData ? binaryData : file.data,
          ContentType: type ? type : file.mimetype,
          ACL: 'public-read',
        };
        s3bucket.upload(params, function (err, data) {
          if (err) {
            console.log('error in callback');
            console.log(err);
            return reject({ errorCode: 1, errorMsg: err.message });
          } else {
            resolve({
              errorCode: 0,
              data: data.Key,
              all: data,
            });
          }
        });
      });
    } else {
      return reject({ errorCode: 1 });
    }
  });
};

module.exports = common
// common.uploadFile = async (req) => {
//   await req.file('file').upload(
//     {
//       maxBytes: maxBytes,
//       dirname: dirname,
//     },
//     (err, upload) => {
//       if (err) return { errCode: 1, errorMsg: err }
//       return { errCode: 0, link: upload[0].fd }
//     }
//   )
// }
// common.uploadImage = async (image) => {
//   return new Promise((resolve, reject) => {
//     {
//       image.upload(
//         {
//           maxBytes: maxBytes,
//           dirname: dirname,
//         },
//         (err, upload) => {
//           if (err) return reject({ errCode: 1, errorMsg: err })
//           return resolve({ errCode: 0, data: upload[0].fd })
//         }
//       )
//     }
//   })
// }

function getExtension(data) {
  let i = data.lastIndexOf('.') || data.lastIndexOf('/');
  return (i < 0) ? '' : data.substr(i);
}
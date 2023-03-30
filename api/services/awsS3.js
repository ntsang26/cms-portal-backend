const AWS_SDK = require('aws-sdk');

let awsS3 = {};
// B1  init service
awsS3.initDigital = () => {
    let spacesEndpoint = new AWS_SDK.Endpoint(
        CConfig.AMAZON_S3.subConfigs.BASE_HOST.value
    );
    return new AWS_SDK.S3({
        endpoint: spacesEndpoint,
        accessKeyId:
            CConfig.AMAZON_S3.subConfigs.ACCESS_KEY_ID_AMAZONE.value,
        secretAccessKey:
            CConfig.AMAZON_S3.subConfigs.SECRET_ACCESS_KEY.value,
    });
};

// B2  createBucket
awsS3.createBucket = (domain) => {
    try {
        const bucketName = CConfig.AMAZON_S3.subConfigs.BUCKET_NAME.value;
        const DIGITAL_HOST = CConfig.AMAZON_S3.subConfigs.DIGITAL_HOST.value;
        var dir = DIGITAL_HOST + domain || '' + '';
        if (!fs.existsSync(dir))
            s3.createBucket({ Bucket: bucketName }, function (error, data) {
                if (error) {
                    return common.systemError(error);
                } else {
                    console.log(`create bucket ${bucketName} aws success`, data); //data: {Location: "http://examplebucket.s3.amazonaws.com/" }
                    return data;
                }
            });
    } catch (error) {
        return common.systemError(error);
    }
};

module.exports = awsS3;

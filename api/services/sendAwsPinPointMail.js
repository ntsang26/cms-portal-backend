const nodemailer = require("nodemailer");
//set NODE_TLS_REJECT_UNAUTHORIZED=0 //need to run command for local window system
module.exports = {
  send: (params) => {
    return new Promise((resolve, reject) => {
      let amazonPpSmtp = CConfig.AMAZON_PP_SMTP.subConfigs;
      // The port to use when connecting to the SMTP server.
      // const port = 587;

      // Replace recipient@example.com with a "To" address. If your account
      // is still in the sandbox, this address must be verified. To specify
      // multiple addresses, separate each address with a comma.
      var toAddresses = params.toAddresses;

      // (Optional) the name of a configuration set to use for this message.
      var configurationSet = "";//"ConfigSet";


      // The message tags that you want to apply to the email.
      var tag0 = "key0=value0";
      var tag1 = "key1=value1";

      // Create the SMTP transport.
      let transporter = nodemailer.createTransport({
        // host: amazonPpSmtp.SMTP_END_POINT.value,
        host: amazonPpSmtp.SMTP_END_POINT.value,
        port: amazonPpSmtp.PORT && amazonPpSmtp.PORT.value ? amazonPpSmtp.PORT.value : 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: amazonPpSmtp.SMTP_USERNAME.value,
          pass: amazonPpSmtp.SMTP_PASSWORD.value
        }
      });

      // Specify the fields in the email.
      let mailOptions = {
        from: amazonPpSmtp.SENDER_ADDRESS.value,
        to: toAddresses,
        subject: params.subject,
        cc: amazonPpSmtp.SMTP_CC_ADDRESSES ? amazonPpSmtp.SMTP_CC_ADDRESSES.value : '',
        bcc: amazonPpSmtp.SMTP_BCC_ADDRESSES ? amazonPpSmtp.SMTP_BCC_ADDRESSES.value : '',
        text: params.template,
        html: params.template,
        // Custom headers for configuration set and message tags.
        headers: {
          'X-SES-CONFIGURATION-SET': configurationSet,
          'X-SES-MESSAGE-TAGS': tag0,
          'X-SES-MESSAGE-TAGS': tag1
        }
      };
      // return mailOptions;

      // Send the email.
      // let info = await transporter.sendMail(mailOptions)
      transporter.sendMail(mailOptions).then(info => {
        console.log("Message sent! Message ID: ", info.messageId);
        resolve(info);
      }, err => {
        resolve(false);
      })
    })
  }
}
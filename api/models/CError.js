/**
 * CErr.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {},
  CODESUCCESS: 0,
  MSG_SUSSESS: sails.__("Success"),
  SUCCESS: { errorCode: 0, errorMsg: sails.__("successfully") },
  SYSTEM_ERROR: { errorCode: 500, errorMsg: sails.__("System Error") },
  TIMEOUT: { errorCode: 400, errorMsg: sails.__("Request timeout") },
  INVALID_PARAMETER: { errorCode: 1, errorMsg: sails.__("Invalid Parameter") },
  DATA_INVALID: { errorCode: 2, errorMsg: sails.__("Data invalid") },
  PASSWORD_INVALID: { errorCode: 3 },
  errorMsg: sails.__("Password invaild"),
  FORBIDDEN: { errorCode: 4, errorMsg: sails.__("Forbidden") },
  TOKEN_NOT_FOUND: { errorCode: 5, errorMsg: sails.__("Token not found") },
  PHONE_ALREADY_EXITS: {
    errorCode: 6,
    errorMsg: sails.__("The phone number has been registered"),
  },
  USER_NAME_ALREADY_EXITS: {
    errorCode: 7,
    errorMsg: sails.__("The username has been registered"),
  },
  USERNAME_PASSWORD_INVALID: {
    errorCode: 8,
    errorMsg: sails.__("Invaild username or password"),
  },
  INVALIDCaptcha: { errorCode: 9, errorMsg: sails.__("Invaild captcha") },
  EMAIL_ALREADY_EXITS: {
    errorCode: 10,
    errorMsg: sails.__("The email has been registered "),
  },
  INVALID_AUTHEN_KEY: {
    errorCode: 11,
    errorMsg: sails.__("Invalid APIKey or AppId"),
  },
  ORGANIZATIONID_ALREADY_EXITS: {
    errorCode: 12,
    errorMsg: sails.__("The organization Id has been registered"),
  },
  ACCOUNT_LOCKED: {
    errorCode: 13,
    errorMsg: sails.__(
      "Your account has been locked. please contact the supporter to have more information"
    ),
  },
  ORGANIZATION_NAME_EXISTED: {
    errorCode: 14,
    errorMsg: sails.__("The organization name has been registered"),
  },
  NEWPASS_DIFFERENT_OLDPASS: {
    errorCode: 409,
    errorMsg: sails.__(
      "The new password must be different from the old password"
    ),
  },
  NOT_FOUND: { errorCode: 404, errorMsg: sails.__("Not Found") },

  ACC_NOT_FOUND: { errorCode: 404, errorMsg: sails.__("Account not found!") },

  TOKEN_EXPIRED: { errorMsg: sails.__("Token expired") },
  INVALID_PROMOTION: { errorCode: 12, errorMsg: sails.__("Promotion Invalid") },
  INVALID_SERVICE: { errorCode: 13, errorMsg: sails.__("Service Invalid") },
  LIMIT_ROWS_TO_MAX: {
    errorCode: 14,
    errorMsg: sails.__("Limit Rows Invalid"),
  },
  LAT_LONG_INVALID: {
    errorCode: 15,
    errorMsg: sails.__("Lat or Long Invalid"),
  },
  INVALID_FORMAT_FIELDS_NAME: {
    errorCode: 16,
    errorMsg: sails.__(
      "Field Name and Field Format is required. Please check again"
    ),
  },
  INVALID_PRIORITY: { errorCode: 17, errorMsg: sails.__("Invalid priority") },
  AUTH_FAIL: { errorCode: 18, errorMsg: sails.__("Invalid token") },
  PASSWORD_NOT_MATCH: {
    errorCode: 20,
    errorMsg: sails.__("Password not match"),
  },
  PHONE_OR_EMAIL_EXISTED: {
    errorCode: 21,
    errorMsg: sails.__("Phone number or email has been registered"),
  },
  MISSING_ROLE: {
    errorCode: 22,
    errorMsg: sails.__("Missing role default of company!"),
  },
  PREFIX_EXISTED: { errorCode: 23, errorMsg: sails.__("Prefix existed") },
  SERVICE_ERROR: { errorCode: 24, errorMsg: sails.__("Service Error") },
  INVALID_TASK: { errorCode: 25, errorMsg: sails.__("Tasks Error") },
  TEMPLATE_NOT_FOUND: {
    errorCode: 26,
    errorMsg: sails.__("Template not found"),
  },
  OTP_NOT_MATCH: {
    errorCode: 27,
    errorMsg: sails.__("The OTP is incorrect or expired."),
  },
  PROCESS_NAME_EXISTED: {
    errorCode: 28,
    errorMsg: sails.__("Process name is existed"),
  },
  WRONG_FORMAT_DATA: {
    errorCode: 29,
    errorMsg: sails.__("Wrong format data,please check again"),
  },
  PROCESS_INVALID: { errorCode: 30, errorMsg: sails.__("Process Invalid") },
  PROCESS_VERSION_NOT_FOUND: {
    errorCode: 31,
    errorMsg: sails.__("Process version not found"),
  },
  VERSION_PORTAL: {
    errorCode: 32,
    errorMsg: sails.__("Please login to correct version portal"),
  },

  // customer app mobile
  INVALID_CUSTOMER_REFID: {
    errorCode: 2001,
    errorMsg: sails.__("Customer Id is required"),
  },
  INVALID_CUSTOMER_INFO: {
    errorCode: 2002,
    errorCodeorMsg: sails.__("Customer info invalid"),
  },
  INVALID_TIER_INFO: {
    errorCode: 2003,
    errorCodeorMsg: sails.__("Tier info invalid"),
  },
  COMPANY_CONFIG_ERROR: {
    errorCode: 2004,
    errorCodeorMsg: sails.__("Company config error"),
  },
  INVALICompany: {
    errorCode: 2004,
    errorCodeorMsg: sails.__("Company config error"),
  },
  INVALID_LANGUAGE: {
    errorCode: 2005,
    errorCodeorMsg: sails.__("Invalid language"),
  },
  PROMOTION_OUT_OF_STOCK: {
    errorCode: 2006,
    errorMsg: sails.__("Promotion out of stock"),
  },
  CUSTOMER_INVALID: { errorCode: 2007, errorMsg: sails.__("Customer Invalid") },
  VOUCHER_INVALID: { errorCode: 2008, errorMsg: sails.__("Voucher Invalid") },
  REQUIRED_VOUCHER_CODE: {
    errorCode: 2009,
    errorMsg: sails.__("voucherCode is required"),
  },
  REQUIRED_PARTNER_REFID: {
    errorCode: 2010,
    errorMsg: sails.__("partnerTransRefId code is required"),
  },
  REQUIRED_PARTNER_CUSTOMER: {
    errorCode: 2011,
    errorMsg: sails.__("partnerCustomerId is required"),
  },
  REQUIRED_PARTNER_MERCHANT: {
    errorCode: 2012,
    errorMsg: sails.__("partnerMerchantId is required"),
  },
  REQUIRED_PARTNER_SHOP: {
    errorCode: 2013,
    errorMsg: sails.__("partnerShopId is required"),
  },
  REQUIRED_TRANSACTION_AMOUNT: {
    errorCode: 2014,
    errorMsg: sails.__("partnerTransactionAmount is required"),
  },
  VOUCHER_NOT_EXIST: {
    errorCode: 2015,
    errorMsg: sails.__("Voucher Code not found or used"),
  },
  CUSTOMER_NOT_FOUND: {
    errorCode: 2016,
    errorMsg: sails.__("Customer not found"),
  },
  MERCHANT_NOT_FOUND: {
    errorCode: 2017,
    errorMsg: sails.__("Merchant not found"),
  },
};

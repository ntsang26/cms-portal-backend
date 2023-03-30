let bcrypt = require('bcryptjs');
let uuid = require('uuid');
var crypto = require('crypto');
const _ = require('lodash');
let auth = {};

const randomString = (length, charsSet) => {
    let chars = charsSet;
    if (length <= 0 || !charsSet) return '';

    var rnd = crypto.randomBytes(length)
        , value = new Array(length)
        , len = chars.length;

    for (var i = 0; i < length; i++) {
        value[i] = chars[rnd[i] % len]
    };

    return value.join('');
}

auth.checkPasswordStrength = (txt, regex) => {
    try {
        let pwdRegex = new RegExp(regex);
        return pwdRegex.test(txt);
    } catch (err) {
        let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
        return mediumRegex.test(txt);
    }
}
auth.isCommonPassword = (txt, client) => {
    //check txt is in array of common passwords
    return true;
}

auth.checkPhoneFormat = (txt, regex) => {
    try {
        let pwdRegex = new RegExp(regex);
        return pwdRegex.test(txt);
    } catch (err) {
        let mediumRegex = new RegExp("^(09)([0-9]{7,9})$");
        return mediumRegex.test(txt);
    }
}


auth.checkUsernameFormat = txt => {
    let usernameRegex = new RegExp("^[0-9a-z_]+$", "i");
    return usernameRegex.test(txt);
}

auth.checkRoleOfficer = (userRoles, ctrl, action) => {
    //console.log('roles', ctrl + ', ' + action + ', ' + JSON.stringify(userRoles));
    return new Promise((resolve, reject) => {
        UserRole.find({ code: userRoles }).then(roles => {
            //console.log('roles', roles.length);
            Permission.findOne({ ctrl, action }).then(p => {
                //console.log('permission', ctrl + '.' + action + ' - ' + JSON.stringify(p));
                if (!p) return reject();
                roles.forEach(r => {
                    if (_.includes(r.permissions, p.id) || p.isCommon)
                        return resolve();
                })

                reject();
            }, err => {
                reject();
            })
        }, err => {
            reject()
        })
    })
}


auth.generateCashCode = () => {
    var millis = Number(new Date());

    return Math.floor(millis / 1000);
    // return 1000 + parseInt(Math.random() * 9000) + '';
}

auth.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
auth.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

auth.createTokenString = () => {
    return uuid.v4();
}
auth.getAccountKitPhoneNumber = (code) => {
    return new Promise((resolve, reject) => {
        // Accountkit.set(Conf.data.ACCOUNT_KIT_APP_ID, Conf.data.ACCOUNT_KIT_APP_SECRET, Conf.data.ACCOUNT_KIT_VERSION); //API_VERSION is optional, default = v1.1
        // Accountkit.requireAppSecret(true); // if you have enabled this option, default = true
        // //authorization_code are the authorizaition code that we get from account kit login operation. look for sample app for more usage information.
        // Accountkit.getAccountInfo(code, function (err, resp) {
        //     if (err) return reject();
        //     let phone = resp.phone.number.replace('+84', '0');
        //     return resolve(phone);
        // });
        resolve('')
    });
}

auth.generateCode = (length) => {
    let chars = "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return randomString(length, chars);
}

auth.generatePIN = () => {
    return randomString(6, '0123456789')
}

module.exports = auth;

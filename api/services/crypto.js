var CryptoJS = require("crypto-js");
var Crypto = require("crypto");
var Base64 = require("crypto-js/enc-base64");


var crypto = {};

// var cryptoXor = require('crypto-xor');


crypto.md5 = opts => {
    let { input } = opts;
    let md5 = CryptoJS.MD5(input).toString().toUpperCase();
    return md5;
}

crypto.GenerateSignature = (opts) => {
    let { input, key } = opts;
    return crypto.HMACMD5(input, key);
}

crypto.HMACMD5 = (raw, key) => {
    return CryptoJS.HmacMD5(raw, key).toString().toUpperCase();
}

crypto.CRC16CCITT = (data) => {
    var crc = 0xFFFF;          // initial value
    var polynomial = 0x1021;   // 0001 0000 0010 0001  (0, 5, 12)

    for (var k = 0; k < data.length; k++) {
        var b = data.charCodeAt(k);
        for (var i = 0; i < 8; i++) {
            var bit = ((b >> (7 - i) & 1) == 1);
            var c15 = ((crc >> 15 & 1) == 1);
            crc <<= 1;
            if (c15 ^ bit) crc ^= polynomial;
        }
    }

    crc &= 0xffff;
    return crc.toString(16);
}

crypto.SHA256 = (raw) => {
    return Crypto.createHash("sha256")
        .update(raw)
        .digest("hex");;
}

crypto.AES = (raw, key) => {
    try {
        let encryptKey = CryptoJS.enc.Utf8.parse(key);

        var data = CryptoJS.AES.encrypt(raw, encryptKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString()
        // rawData = JSON.parse(rawData);
        return data;
    } catch (e) {
        sails.log(e)
    }
}

crypto.decryptAES = (data, key) => {
    try {
        let decryptKey = CryptoJS.enc.Utf8.parse(key);

        var rawData = CryptoJS.AES.decrypt(data, decryptKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8)
        // rawData = JSON.parse(rawData);
        return rawData;
    } catch (e) {
        sails.log(e)
    }
}

// // TuPT add 25/12/2020
// crypto.encrypt = (text) => {
//     const bufferText = Buffer.from(text, 'utf8');
//     text = bufferText.toString('hex');

//     var cypherText = cryptoXor.encode(text, constant.ENCRYPT_KEY);
//     return cypherText.toString();
// }

// crypto.decrypt = (text) => {
//     try {
//         var decodedCypher = cryptoXor.decode(text, constant.ENCRYPT_KEY);

//         const convert = (from, to) => str => Buffer.from(str, from).toString(to)
//         const hexToUtf8 = convert('hex', 'utf8')
//         text = hexToUtf8(decodedCypher);

//         return text;
//     } catch (er) {
//         return text;
//     }
// }

module.exports = crypto;

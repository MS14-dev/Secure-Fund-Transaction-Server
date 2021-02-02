var CryptoJS=require('crypto-js')
var {key,salt}=require('./key')


const encryptByDES=(message, key,salt)=> {
    
    var keyHex = CryptoJS.enc.Utf16.parse(key);
    const iv = CryptoJS.enc.Base64.parse(salt);
    
    var encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {iv});
    
    return encrypted.toString();
}

const   decryptByDES=(ciphertext, key,salt)=> {
    var keyHex = CryptoJS.enc.Utf16.parse(key);
    const iv = CryptoJS.enc.Base64.parse(salt);

    
    var decrypted = CryptoJS.TripleDES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {iv});

    return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports={
    encrypt:encryptByDES,
    decrypt:decryptByDES
}

const CryptoJS=require('crypto-js');
        
const  encryptByAES=(text,key,salt)=>{

    //const keyutf = CryptoJS.enc.Utf8.parse(key);
    const keyutf = CryptoJS.enc.Utf8.parse(key);
    //const iv = CryptoJS.enc.Base64.parse(salt);
    const iv = CryptoJS.enc.Utf8.parse(salt);
    const enc = CryptoJS.AES.encrypt(text, keyutf, { iv: iv });
    
    return enc.toString();
}

const decryptByAES=(cipherText,key,salt)=>{

    //const keyutf = CryptoJS.enc.Utf8.parse(key);
    const keyutf = CryptoJS.enc.Utf8.parse(key);
    //const iv = CryptoJS.enc.Base64.parse(salt);
    const iv = CryptoJS.enc.Utf8.parse(salt);
    //const dec = CryptoJS.TripleDES.decrypt({ciphertext:CryptoJS.enc.Base64.parse(cipherText)},keyutf,{iv:iv});
    const dec = CryptoJS.AES.decrypt(cipherText,keyutf,{iv:iv});
    //return CryptoJS.enc.Utf8.stringify(dec);
    
    return CryptoJS.enc.Utf8.stringify(dec);
  
    
}


module.exports={
    encrypt:encryptByAES,
    decrypt:decryptByAES
}

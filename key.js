// var key = 'Key';
// var salt='Salt'

//..............new!!!
require('dotenv').config()

module.exports = {
    key:process.env.key,
    salt:process.env.salt
};



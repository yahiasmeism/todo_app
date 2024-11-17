const { model } = require('mongoose');
const allowedOrigins = require('./allowedOrigins');
const corsOption = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allwoed by CORS'));
        }
    },
    credentials: true,
    optionsSucessStatus: 200,
}


module.exports = corsOption;
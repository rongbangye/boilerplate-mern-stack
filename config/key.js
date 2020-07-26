// if develop environment is at production, use prod.js, else use dev.js
if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}
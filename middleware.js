const ExpressError = require('./errorClass')

function logger(req, res, next) {
    console.log()
    return next();
}
//module.exports = {logger: logger, checkForPassword: checkForPassword}
module.exports = {logger: logger}

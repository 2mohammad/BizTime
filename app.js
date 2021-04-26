const express = require('express')
const morgan = require('morgan')
const app = express()
const ExpressError = require("./errorClass")
const middleware = require('./middleware')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(middleware.logger)
app.use(morgan('dev'))

const uRoutes = require("./routes/users");
app.use("/users", uRoutes);

app.use(function (req, res, next){
    const err = new ExpressError("Not Found", 404);
    return next(err);
});

app.use(function (err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
  
    // set the status and alert the user
    return res.status(status).json({
      error: {
        message: err.message,
        status: status
      }
    });
  });

app.get('/', (req, res, next)=>{
    return res.send("Works")
})

module.exports = app



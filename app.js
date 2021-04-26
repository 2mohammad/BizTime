const express = require('express')
const morgan = require('morgan')
const app = express()
const ExpressError = require("./errorClass")
const middleware = require('./middleware')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(middleware.logger)
app.use(morgan('dev'))

const cRoutes = require("./routes/companies/companies");
app.use("/companies", cRoutes);

const iRoutes = require("./routes/invoices/invoices");
app.use("/invoices", iRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
  });
});


app.get('/', (req, res, next)=>{
    return res.send("Works")
})

module.exports = app



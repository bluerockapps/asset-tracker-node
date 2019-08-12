const express           = require('express');
const https             = require('https');
const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const cors              = require('cors')
const { Pool, Client }  = require('pg');
// const XeroClient        = require('xero-node').AccountingAPIClient;
const config            = require('./config');
const app               = express();
const serveStatic       = require('serve-static');
// const stripe            = require('stripe')('sk_test_iNu0RRvzmGevtitxbB7NPHAz00t8CvbrOr');
const fs                = require('fs');
// const jwt               = require('jsonwebtoken');
// const bcrypt            = require('bcryptjs');

//database
const pg = new Client({
  user:     config.database.user,
  host:     config.database.host,
  database: config.database.database,
  password: config.database.password,
  port:     config.database.port,
})
pg.connect();

//xero
// const xeroClient = new XeroClient({
//   appType:        config.xero.appType,
//   consumerKey:    config.xero.consumerKey,
//   consumerSecret: config.xero.consumerSecret,
//   privateKeyPath: config.xero.privateKeyPath
// })

var bluerockappsAPI = config.bluerockappsAPI;
  
//cors
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('assets'));

//routes
require('./app/routes')(app, pg, bluerockappsAPI);
// require('./app/routes')(app, client, xeroClient, stripe);

// server run
const port = 8000;
app.listen(port, () => {
  console.log('We are live on ' + port);
});

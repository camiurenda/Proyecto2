require('dotenv').config()
const express = require('express')
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
const swaggerSpec = require('./src/utils/swagger');

// const swaggerUi = require('swagger-ui-express')
// const swaggerDocument = require('./swagger-output.json');

//Routers
// const loginRouter = require("./src/modules/login/login.routes");
// const reclamoRouter = require("./src/modules/claim/claim.routes");
const usuarioRouter = require("./src/modules/user/user.routes");
const productoRouter = require("./src/modules/products/products.routes")
// const areaRouter = require("./src/modules/area/area.routes");
// const claimTypeRoute = require("./src/modules/claimType/claimType.routes");
// const auditRoute = require("./src/modules/audit/audit.routes");
// const notifyRoute = require("./src/modules/notify/notify.routes");

// Secure setup
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()
const port = process.env.PORT

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://proyecto2front.vercel.app',
  'https://proyecto2server.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


//const uri = 'mongodb+srv://urendacamila:urendacamilaMongo@clustermongodb.95vstra.mongodb.net/PROYECTO2';

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.get("/", async (request, response) => {
      return response.send("Beckend reclamos node js express");
});

// Routers
// app.use(loginRouter);
// app.use(reclamoRouter);
app.use(usuarioRouter);
app.use(productoRouter)
// app.use(areaRouter);
// app.use(claimTypeRoute);
// app.use(auditRoute);
// app.use(notifyRoute);

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-UserId, X-Nonce' +
    ', X-Secret, X-Ts, X-Sig, X-Vendor-Sig, X-Vendor-Apikey, X-Vendor-Nonce, X-Vendor-Ts, X-ProfileId' +
    ', X-Authorization, Authorization, Token, Pragma, Cache-Control, Expires');
  res.header('Access-Control-Allow-Methods', 'HEAD,OPTIONS,GET,PUT,POST,DELETE');
  next();
});
var options = {
  explorer: true
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

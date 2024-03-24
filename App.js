// Imports
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./database');
const feedDB = require('./routers/feed.router');
const users = require('./routers/user.router');
const messages = require('./routers/chat.router');

const app = express();


app.use('/feedDB',feedDB);
app.use('/users',users);
app.use('/chats',messages);

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode > 400
    }
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    // Set response headers
    res.header('Access-Control-Allow-Origin', '*'); // Allow access to any (*) site
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // We set which kind of headers we want to accept

    // Set available request methods
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next(); // Go to next middleware
});

app.use((req, res, next) => {
    const error = new Error('No route was found for this request!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});
//
// TODO
//  const swaggerJsdoc = require("swagger-jsdoc");
//     swaggerUi = require("swagger-ui-express");
// TODO Swagger UI
//  const options = {
//     definition: {
//         openapi: "3.1.0",
//         info: {
//             title: "Socializing API",
//             version: "0.1.0",
//             description:
//                 "This is an API made with Express and documented with Swagger"
//         },
//         servers: [
//             {
//                 url: "http://localhost:3000",
//             },
//         ],
//     },
//     apis: ["./controllers/*.js"],
//   };
//  const specs = swaggerJsdoc(options);
//   app.use(
//     "/api-docs",
//     swaggerUi.serve,
//     swaggerUi.setup(specs)
//  );

module.exports = app;

// Import the required libraries
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import config from './config.mjs';
// Import the passport Azure AD library
import { BearerStrategy } from 'passport-azure-ad';

import Sequelize from 'sequelize';
import dbConfig from "./config/database.js";
import User from "./models/user.js"

const {DataTypes} = Sequelize

// Set the Azure AD B2C options
const options = {
    identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.clientID,
    issuer: config.credentials.issuer,
    policyName: config.policies.policyName,
    isB2C: config.settings.isB2C,
    scope: config.resource.scope,
    validateIssuer: config.settings.validateIssuer,
    loggingLevel: config.settings.loggingLevel,
    passReqToCallback: config.settings.passReqToCallback
}

// Instantiate the passport Azure AD library with the Azure AD B2C options
const bearerStrategy = new BearerStrategy(options, (token, done) => {
        // Send user info using the second argument
        done(null, { }, token);
    }
);

const connection = new Sequelize.Sequelize(dbConfig);
const user = User(connection, DataTypes)
// Use the required libraries
const app = express();

app.use(morgan('dev'));

app.use(passport.initialize());

passport.use(bearerStrategy);

//enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// API anonymous endpoint
app.get('/public', async (req, res) =>  res.status(200).json(await user.findAll()));

// API protected endpoint
app.get('/hello',
    passport.authenticate('oauth-bearer', {session: false}),
    async (req, res) => {
        console.log('Validated claims: ', req.authInfo);
        
        await user.create({
            firstName: req.authInfo['given_name'],
            lastName: req.authInfo['family_name'],
            email: "email@email.com"
        })

        // Service relies on the name claim.  
        res.status(200).json({'name': req.authInfo['name']});
    }
);

// Starts listening on port 6000
const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
export default {
    credentials: {
        tenantName: "c3cb2c",
        clientID: "5b08e6a4-9919-4ed8-a767-a13a2af285be",
        issuer: "https://c3cb2c.b2clogin.com/b6c63695-4c74-4913-b45b-baac95e40e43/v2.0/"
    },
    policies: {
        policyName: "b2c_1_criareentrar"
    },
    resource: {
        scope: ["tasks.read"]
    },
    metadata: {
        discovery: ".well-known/openid-configuration",
        version: "v2.0"
    },
    settings: {
        isB2C: true,
        validateIssuer: true,
        passReqToCallback: false,
        loggingLevel: "info"
    }
}
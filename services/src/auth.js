const { OAuth2Client } = require('google-auth-library');
const appId = '579127180841-peva9nafnfmrmkqamrnmbdai6o1phvot.apps.googleusercontent.com';

async function verify(token) {
    const client = new OAuth2Client(appId);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: appId
    });
    const payload = ticket.getPayload();
    return payload;
}

async function authenticate (req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7, authHeader.length);
        try {
            const payload = await verify(token);
            req.authenticatedUser = payload;
            next();
        } catch (error) {
            console.warn(error.message);
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
}

module.exports = {
    authenticate: authenticate
}
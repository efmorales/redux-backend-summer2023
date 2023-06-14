const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    console.log("Middleware!!!!")
    try {
        const bearerToken = req.headers.authorization;
        if (bearerToken) {
            console.log(bearerToken);
            const token = bearerToken.split (" ")[1];
            let decoded = jwt.verify(token, process.env.JWT_KEY);
            // console.log('!@-------decoded-------@!')
            // console.log(decoded);
            req.decoded = decoded;

            next()  
        } else {
            throw {
                status: 403,
                message: 'Missing Token'
            }
        }
    } catch (error) {
       res.status(error.status || 401).json(error.message) 
    }
}

module.exports = { verifyToken }
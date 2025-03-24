const jwt = require('jsonwebtoken');

exports.authJWT = (req, res, next) => {
    let error;
    let user;

    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function(err, decoded) {
        error = err;
        user = decoded;
    });

    if(!error) {
        next()
    } else {
        console.log(error)
        return res.status(403).json({mensaje: "Ande ibaaaa"})
    }
    ;
}
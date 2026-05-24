const authMiddleware = (req, res, next) => {

    const token = req.headers.authorization;

    console.log(token);

    if(!token){

        return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        });

    }

    if(token !== "Bearer qms-secret-token"){

        return res.status(403).json({
            success: false,
            message: "Invalid token"
        });

    }

    next();

};

module.exports = authMiddleware;
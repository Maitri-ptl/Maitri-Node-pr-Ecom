import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token" })
        }

        const token = authorization.split(' ')[1];

        try {
            if (!token) {
                return res.status(401).json({ message: "Token is not provided" })
            }

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            return next();


        } catch (error) {
            if (error.name == "TokenExpiredError") {
                return res.status(401).json({ message: "Please login again" })
            }
            return res.status(401).json({ message: "Invalid token" })
        }


    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export const verifyUser = (req,res,next)=>{
    try {
        const {id} = req.params;

        if(req.user.id != id) return res.status(401).json({message : "unathorized"})
        return next();

    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

export const adminAuth = (req,res,next)=>{
    try {

        if(req.user.role != "admin") return res.status(401).json({message : "unathorized"})
        return next();
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

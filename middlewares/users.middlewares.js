export function authMiddleware(req, res, next){
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({message: 'No token provided'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            res.status(401).json({message: 'Invalid token'});
        }
        req.user = decoded;
        next();
    })
}
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    // 1. Get the token from the header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    
    const token = authHeader.split(" ")[1];

    try {
        // 2. Decode and verify the token instantly using your shared secret
        // This will extract the exact payload { id: '...', role: 'doctor' }
        const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach the specific user's data to the request
        req.user = decodedUserData;

        next(); 
    } catch (error) {
        // If the token is fake, expired, or the secrets don't match, it falls here
        console.error("JWT Error:", error.message);
        return res.status(403).json({ success: false, message: "Forbidden: Invalid or expired token" });
    }
};
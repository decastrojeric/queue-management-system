export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // Ensure user data exists from the authMiddleware
        if (!req.user || !req.user.role) {
            return res.status(403).json({ 
                success: false, 
                message: "Role information missing. Access denied." 
            });
        }

        // Check if the user's role is in the list of allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Role '${req.user.role}' is not authorized to access this route.` 
            });
        }

        // Access Granted
        next();
    };
};
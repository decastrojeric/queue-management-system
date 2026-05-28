const ALLOWED_ROLES = ["patient", "doctor", "staff", "admin"];

export const roleMiddleware = (roles = ALLOWED_ROLES) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        // 1. block if no role in token
        if (!userRole) {
            return res.status(401).json({
                message: "No role found in token"
            });
        }

        // 2. block invalid roles (extra safety layer)
        if (!ALLOWED_ROLES.includes(userRole)) {
            return res.status(403).json({
                message: "Invalid role detected"
            });
        }

        // 3. check if role is allowed for this route
        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied for this role"
            });
        }

        next();
    };
};
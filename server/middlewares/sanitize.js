// Simple MongoDB injection prevention middleware
export const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                if (key.startsWith('$') || key.includes('.')) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                }
            });
        }
        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    
    next();
};

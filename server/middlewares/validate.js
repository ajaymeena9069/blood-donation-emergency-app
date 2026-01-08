const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
            // Handle Zod error properly
            if (result.error && result.error.errors) {
                const errors = result.error.errors.map(err => ({
                    field: err.path?.join('.') || 'unknown',
                    message: err.message || 'Validation error',
                }));

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
            } else {
                // Fallback for unexpected error format
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: [{ field: 'unknown', message: 'Invalid data format' }]
                });
            }
        }

        req.body = result.data;
        next();
    } catch (error) {
        console.error("Validation middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const validateParams = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.params);
        
        if (!result.success) {
            // Handle Zod error properly
            if (result.error && result.error.errors) {
                const errors = result.error.errors.map(err => ({
                    field: err.path?.join('.') || 'unknown',
                    message: err.message || 'Validation error',
                }));

                return res.status(400).json({
                    success: false,
                    message: "Invalid URL parameters",
                    errors,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid URL parameters",
                    errors: [{ field: 'unknown', message: 'Invalid parameters format' }]
                });
            }
        }

        req.params = result.data;
        next();
    } catch (error) {
        console.error("Params validation error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const validateQuery = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.query);
        
        if (!result.success) {
            // Handle Zod error properly
            if (result.error && result.error.errors) {
                const errors = result.error.errors.map(err => ({
                    field: err.path?.join('.') || 'unknown',
                    message: err.message || 'Validation error',
                }));

                return res.status(400).json({
                    success: false,
                    message: "Invalid query parameters",
                    errors
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid query parameters",
                    errors: [{ field: 'unknown', message: 'Invalid query format' }]
                });
            }
        }

        req.query = result.data;
        next();
    } catch (error) {
        console.error("Query validation error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export { validate, validateParams, validateQuery };
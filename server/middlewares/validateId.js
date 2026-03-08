// middlewares/validateId.js
import mongoose from 'mongoose';

export const validateId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format',
            errors: [{ field: 'id', message: 'Please provide a valid ID' }]
        });
    }
    
    next();
};
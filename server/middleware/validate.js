import {ValidationError} from "./errorHandler.js"
import {z} from "zod";

export const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch(error) {
        if (!(error instanceof z.ZodError)) {
             console.error("Validation Middleware Crash:", error);
        }
        if (error instanceof z.ZodError || error.name === 'ZodError') {
      
      const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      // next(new ValidationError(message));
      return res.status(400).json({ error: message });
    } else {
      next(error);
    }
  }
    
};

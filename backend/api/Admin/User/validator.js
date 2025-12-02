import Joi from "joi";

// Middleware to validate user creation
async function userSchema(req, res, next) {
  try {
    const schema = Joi.object({
      username: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          "string.empty": "Username is required",
          "string.min": "Username must be at least 2 characters",
          "string.max": "Username must be at most 50 characters",
          "any.required": "Username is required",
        }),

      email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty": "Email is required",
          "string.email": "Please provide a valid email",
          "any.required": "Email is required",
        }),

      phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          "string.empty": "Phone number is required",
          "string.pattern.base": "Enter a valid 10-digit phone number",
          "any.required": "Phone number is required",
        }),
    }).options({ stripUnknown: true }); // remove unknown fields automatically

    // Validate asynchronously
    req.body = await schema.validateAsync(req.body);

    next(); // pass control to controller
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.details ? err.details.map(d => d.message) : err.message,
    });
  }
}

export default { userSchema };

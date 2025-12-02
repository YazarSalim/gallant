import Joi from "joi";

// Validate create/update client
async function validateClient(req, res, next) {
  try {
    // For create: all required
    // For update: fields are optional
    const schema = Joi.object({
      clientCode: req.method === "POST"
        ? Joi.string().trim().required().messages({
            "string.empty": "Client code is required",
            "any.required": "Client code is required",
          })
        : Joi.string().trim().optional(),
      clientName: req.method === "POST"
        ? Joi.string().trim().required().messages({
            "string.empty": "Client name is required",
            "any.required": "Client name is required",
          })
        : Joi.string().trim().optional(),
      contact: req.method === "POST"
        ? Joi.string().trim().required().messages({
            "string.empty": "Contact is required",
            "any.required": "Contact is required",
          })
        : Joi.string().trim().optional(),
    }).options({ stripUnknown: true });

    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

// Validate ID in path params
async function validateIdParam(req, res, next) {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "ID must be a number",
        "number.integer": "ID must be an integer",
        "number.positive": "ID must be a positive number",
        "any.required": "ID parameter is required",
      }),
    });

    req.params = await schema.validateAsync(req.params);
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

// Validate pagination query params
async function validatePagination(req, res, next) {
  try {
    const schema = Joi.object({
      page: Joi.number().integer().positive().default(1).messages({
        "number.base": "Page must be a number",
        "number.integer": "Page must be an integer",
        "number.positive": "Page must be a positive number",
      }),
      limit: Joi.number().integer().positive().default(10).messages({
        "number.base": "Limit must be a number",
        "number.integer": "Limit must be an integer",
        "number.positive": "Limit must be a positive number",
      }),
    });

    req.query = await schema.validateAsync(req.query);
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

export default {
  validateClient,
  validateIdParam,
  validatePagination,
};

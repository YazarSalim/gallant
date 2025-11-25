import Joi from "joi";

async function validateCreateClient(req, res, next) {
  try {
    const schema = Joi.object({
      clientCode: Joi.string().trim().required().messages({
        "string.empty": "Client code is required",
        "any.required": "Client code is required",
      }),
      clientName: Joi.string().trim().required().messages({
        "string.empty": "Client name is required",
        "any.required": "Client name is required",
      }),
      contact: Joi.string().trim().required().messages({
        "string.empty": "Contact is required",
        "any.required": "Contact is required",
      }),
    }).options({ stripUnknown: true });

    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

export default {
  validateCreateClient,
};

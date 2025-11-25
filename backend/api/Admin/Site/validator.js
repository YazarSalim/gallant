import Joi from 'joi'
async function validateCreateSite(req, res, next) {
  try {
    const schema = Joi.object({
      siteCode: Joi.string().trim().required().messages({
        "string.empty": "Site code is required",
        "any.required": "Site code is required",
      }),
      siteName: Joi.string().trim().required().messages({
        "string.empty": "Site name is required",
        "any.required": "Site name is required",
      }),
      clientId: Joi.number().integer().required().messages({
        "number.base": "Client ID must be a number",
        "any.required": "Client ID is required",
      }),
    }).options({ stripUnknown: true });

    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

export default {validateCreateSite}
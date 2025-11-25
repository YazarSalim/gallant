import Joi from 'joi'
async function validateCreateJob(req, res, next) {
  try {
    const schema = Joi.object({
      jobCode: Joi.string().trim().required().messages({
        "string.empty": "Job code is required",
        "any.required": "Job code is required",
      }),
      jobName: Joi.string().trim().required().messages({
        "string.empty": "Job name is required",
        "any.required": "Job name is required",
      }),
      clientId: Joi.number().integer().required().messages({
        "number.base": "Client ID must be a number",
        "any.required": "Client ID is required",
      }),
      siteId: Joi.number().integer().required().messages({
        "number.base": "Site ID must be a number",
        "any.required": "Site ID is required",
      }),
    }).options({ stripUnknown: true });

    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

export default {validateCreateJob}
const { check } = require('express-validator');
const { sanitizeBody } = require('express-validator');

/* Validation/Sanitization */
exports.validate = (method) => {
  switch (method) {
    case 'createMessage': {
      return [
        // Validate
        check('subject', 'Subject must be between 0 and 100 characters').isLength({ min: 0, max: 100 }).trim().optional(),
        check('message', 'Message must contain message').exists(),
        check('captcha', 'Message must contain captcha').exists(),
        check('message', 'Message must be between 1 and 10000 characters').isLength({ min: 1, max: 10000 }).trim(),

        // Sanitize
        sanitizeBody('subject').trim(),
        sanitizeBody('email').trim(),
        sanitizeBody('message').trim(),
      ];
    }
    default:
      return [];
  }
};

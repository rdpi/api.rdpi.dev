const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const messageValidator = require('../validators/messageValidator');

/* POST(create) new message */
router.post('/', messageValidator.validate('createMessage'), messageController.createMessage);

module.exports = router;
const axios = require('axios');
const { validationResult } = require('express-validator');
const { Message } = require('../models');

exports.createMessage = (req, res, next) => {
  const err = new Error();
  const validerr = validationResult(req);
  if(!validerr.isEmpty()){
    const err = new Error();
    err.status = 400;
    err.message = 'Validation Failed';
    err.validationErrors = validerr.array();
    console.log(err.validationErrors);
    return next(err);
  }
  const { body: { captcha, subject, email, message } } = req;

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: {
      secret: process.env.RECAPTCHA_SECRET,
      response: captcha,
    }
  }
  return axios.post('https://www.google.com/recaptcha/api/siteverify', {}, config)
  .then((rcRes) => {
    if (!rcRes.data.success) {
      console.log(rcRes.data);
      err.status = 400;
      err.message = 'Recaptcha verification failed';
      return next(err);
    }
    const defaults = {};
    if(email){
      defaults.email = email;
    };
    if(subject){
      defaults.subject = subject;
    }
    defaults.message = message;
    console.log(defaults);
    return Message.create(defaults).then(newMessage => res.json({status: 200, newMessage}));
  }).catch((error) => {
    console.log(error);
    err.status = 500;
    err.message = "Server Error"
    err.error = error;
    return next(err);
  });
}

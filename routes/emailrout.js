const express = require('express');
const router = express.Router();
const controller = require('../controllers/emailcontroller');

router
.post('/badmail',controller.Sendbadmail)
.post('/gaodmail',controller.Sendgoodmail)

module.exports = router;


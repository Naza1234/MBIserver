const express = require('express');
const router = express.Router();
const controller = require('../controllers/emailcontroller');

router
.post('/badmail',controller.Sendbadmail)
.post('/gaodmail',controller.Sendgoodmail)
.post('/congmail',controller.Sendcongmail)

module.exports = router;


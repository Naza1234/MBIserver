const express = require('express');
const router = express.Router();
const controller = require('../controllers/PaymentGateWaycontrollers');

router
.post('/', controller.AddPaymentGateWay)
.get('/', controller.GetAllPaymentGateWay)
.get('/:id', controller.GetSinglePaymentGateWay)
.put('/:id', controller.UpdateSinglePaymentGateWay)
.delete('/:id', controller.DeleteSinglePaymentGateWay)

module.exports = router;


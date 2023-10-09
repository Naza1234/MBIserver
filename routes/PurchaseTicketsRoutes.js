const express = require('express');
const router = express.Router();
const controller = require('../controllers/PurchaseControllers');

router
.post('/',controller.uplaod, controller.AddPurchaseTickets)
.get('/', controller.GetAllPurchaseTickets)
.get('/:id', controller.GetSinglePurchaseTickets)
.put('/:id', controller.UpdateSinglePurchaseTickets)
.delete('/:id', controller.DeleteSinglePurchaseTickets)

module.exports = router;


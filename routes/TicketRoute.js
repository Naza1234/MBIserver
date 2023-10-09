const express = require('express');
const router = express.Router();
const controller = require('../controllers/TicketsControllers');

router
.post('/', controller.AddTickets)
.post('/getWonTickets', controller.getWonTickets)
.get('/', controller.GetAllTicket)
.get('/:id', controller.GetSingleTicket)
.put('/:id', controller.UpdateSingleTicket)
.delete('/:id', controller.DeleteSingleTicket)

module.exports = router;


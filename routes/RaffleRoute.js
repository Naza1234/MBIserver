const express = require('express');
const router = express.Router();
const controller = require('../controllers/RaffleControllers');

router
.post('/',controller.uplaod, controller.AddRaffle)
.get('/', controller.GetAllRaffle)
.get('/ticket/:id', controller.GetAllTicket)
.get('/ticketBoth/:id', controller.GetAllTicketBoth)
.get('/:id', controller.GetSingleRaffle)
.put('/:id', controller.UpdateSingleRaffle)
.delete('/:id', controller.DeleteSingleRaffle)

module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/RaffleRequestControllers');

router
.post('/',controller.uplaod, controller.AddRaffleRequest)
.get('/', controller.GetAllRaffleRequest)
.get('/:id', controller.GetSingleRaffleRequest)
.put('/:id', controller.UpdateSingleRaffleRequest)
.delete('/:id', controller.DeleteSingleRaffleRequest)

module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserControllers');

router
.post('/signup', controller.SignupUsers)
.post('/login', controller.LoginUsers)
.get('/', controller.GetAllUsers)
.get('/search/:id', controller.search)
.get('/tickets/:id', controller.tickets)
.get('/:id', controller.GetSingleUsers)
.put('/:id', controller.UpdateSingleUsers)
.delete('/:id', controller.DeleteSingleUsers)

module.exports = router;


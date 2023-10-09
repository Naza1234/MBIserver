const express = require('express');
const router = express.Router();
const controller = require('../controllers/DoYouKnowControllers');

router
.post('/',controller.uplaod, controller.AddDoYouKnow)
.get('/', controller.GetAllDoYouKnow)
.get('/:id', controller.GetSingleDoYouKnow)
.put('/:id', controller.UpdateSingleDoYouKnow)
.delete('/:id', controller.DeleteSingleDoYouKnow)

module.exports = router;


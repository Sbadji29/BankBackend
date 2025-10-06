const express = require('express');
const router = express.Router();
const transactionController = require('../controller/transactionController');

router.post('/depot', transactionController.creerDepot);

router.patch('/depot/annuler/:idTransaction', transactionController.annulerDepot);

router.get('/', transactionController.listerTransactions);

module.exports = router;

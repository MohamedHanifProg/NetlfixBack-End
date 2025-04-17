// routes/adminRoutes.js
const express = require('express');
const router  = express.Router();

const programRoutes = require('./programRoutes');
const logRoutes     = require('./logRoutes');

router.use('/programs', programRoutes);
router.use('/logs',     logRoutes);


module.exports = router;

const express = require('express');
const router = express.Router();
const { createProgram, updateProgram, deleteProgram, getProgram, getPrograms } = require('../controllers/programController');
const { protect } = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');

router.post('/', protect, adminOnly, createProgram);
router.put('/:id', protect, adminOnly, updateProgram);
router.delete('/:id', protect, adminOnly, deleteProgram);
router.get('/:id', protect, getProgram);
router.get('/', protect, getPrograms);

module.exports = router;

const express = require('express');
const router = express.Router();
const { findCentralLocation, searchGroupPlaces, getGroupPlans } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

router.post('/find-location', findCentralLocation);
router.post('/search', searchGroupPlaces);
router.get('/plans', protect, getGroupPlans);

module.exports = router;

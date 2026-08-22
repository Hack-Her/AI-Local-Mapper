const express = require('express');
const router = express.Router();
const { searchPlaces, getPlaceDetails } = require('../controllers/placeController');

router.post('/search', searchPlaces);
router.get('/:placeId', getPlaceDetails);

module.exports = router;

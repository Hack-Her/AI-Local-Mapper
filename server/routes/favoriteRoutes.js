const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, deleteFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.delete('/:placeId', protect, deleteFavorite);

module.exports = router;

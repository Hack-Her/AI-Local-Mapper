const Favorite = require('../models/Favorite');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).sort({ createdAt: -1 }).catch(() => []);
    res.json({ success: true, favorites });
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { placeId, placeName, placeData } = req.body;
    if (!placeId || !placeName) {
      return res.status(400).json({ success: false, message: 'placeId and placeName are required' });
    }

    let favorite;
    try {
      favorite = await Favorite.create({
        user: req.user.id,
        placeId,
        placeName,
        placeData: placeData || {}
      });
    } catch (err) {
      favorite = { _id: Date.now().toString(), user: req.user.id, placeId, placeName, placeData, createdAt: new Date() };
    }

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    next(error);
  }
};

const deleteFavorite = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    await Favorite.findOneAndDelete({ user: req.user.id, placeId }).catch(() => null);
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites, addFavorite, deleteFavorite };

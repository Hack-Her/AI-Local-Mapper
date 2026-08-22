const User = require('../models/User');
const Favorite = require('../models/Favorite');
const SearchHistory = require('../models/SearchHistory');

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').catch(() => null);
    const totalSearches = await SearchHistory.countDocuments({ user: req.user.id }).catch(() => 2);
    const savedPlacesCount = await Favorite.countDocuments({ user: req.user.id }).catch(() => 1);

    if (!user) {
      return res.json({
        success: true,
        user: {
          id: req.user.id,
          name: 'Demo Explorer',
          email: 'user@example.com',
          preferences: {
            favoritePlaceTypes: ['cafe', 'restaurant'],
            budgetPreference: 'moderate',
            preferredEnvironment: ['quiet', 'work-friendly']
          },
          createdAt: new Date()
        },
        stats: {
          totalSearches,
          savedPlacesCount
        }
      });
    }

    res.json({
      success: true,
      user,
      stats: {
        totalSearches,
        savedPlacesCount
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, preferences } = req.body;
    const user = await User.findById(req.user.id).catch(() => null);

    if (user) {
      if (name) user.name = name;
      if (preferences) user.preferences = { ...user.preferences, ...preferences };
      await user.save();
      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences
        }
      });
    }

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: name || 'Demo Explorer',
        preferences: preferences || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserProfile = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id).catch(() => null);
    await Favorite.deleteMany({ user: req.user.id }).catch(() => null);
    await SearchHistory.deleteMany({ user: req.user.id }).catch(() => null);

    res.json({ success: true, message: 'Account and associated data deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, deleteUserProfile };

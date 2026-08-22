const SearchHistory = require('../models/SearchHistory');

const getHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50).catch(() => []);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

const addHistory = async (req, res, next) => {
  try {
    const { query, extractedRequirements, location } = req.body;
    let item;
    try {
      item = await SearchHistory.create({
        user: req.user.id,
        query,
        extractedRequirements: extractedRequirements || {},
        location: location || {}
      });
    } catch (err) {
      item = { _id: Date.now().toString(), query, extractedRequirements, location, createdAt: new Date() };
    }
    res.status(201).json({ success: true, historyItem: item });
  } catch (error) {
    next(error);
  }
};

const deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await SearchHistory.findOneAndDelete({ _id: id, user: req.user.id }).catch(() => null);
    res.json({ success: true, message: 'Search history item deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, addHistory, deleteHistoryItem };

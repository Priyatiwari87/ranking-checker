const CheckHistory = require('../models/CheckHistory');

/**
 * In-memory fallback store when MongoDB is not connected
 */
let inMemoryHistory = [];

exports.addInMemoryHistory = (record) => {
  record._id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  inMemoryHistory.unshift(record);
  if (inMemoryHistory.length > 100) inMemoryHistory.pop();
  return record._id;
};

exports.getInMemoryHistory = () => inMemoryHistory;

/**
 * GET /api/history - Retrieve check history list with search, filter, pagination.
 */
exports.getHistory = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20, sort = 'checkedAt', order = 'desc' } = req.query;

    if (!req.dbConnected) {
      // In-memory fallback
      let filtered = [...inMemoryHistory];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          item =>
            item.businessName.toLowerCase().includes(q) ||
            item.domain.toLowerCase().includes(q) ||
            item.searchQuery.toLowerCase().includes(q)
        );
      }

      if (status === 'found') filtered = filtered.filter(item => item.found);
      if (status === 'not_found') filtered = filtered.filter(item => !item.found);

      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + parseInt(limit, 10));

      return res.status(200).json({
        success: true,
        data: paginated,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(total / limit) || 1
        },
        source: 'in_memory'
      });
    }

    // MongoDB query
    const query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ businessName: regex }, { domain: regex }, { searchQuery: regex }];
    }

    if (status === 'found') query.found = true;
    if (status === 'not_found') query.found = false;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortField = sort === 'ranking' ? 'ranking' : 'checkedAt';

    const [items, total] = await Promise.all([
      CheckHistory.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      CheckHistory.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / limit) || 1
      },
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch search history.'
    });
  }
};

/**
 * GET /api/history/:id - Retrieve single check detail.
 */
exports.getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.dbConnected || id.startsWith('mem_')) {
      const item = inMemoryHistory.find(i => i._id === id);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Check record not found.' });
      }
      return res.status(200).json({ success: true, data: item });
    }

    const item = await CheckHistory.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Check record not found.' });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching history item:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch record details.' });
  }
};

/**
 * DELETE /api/history/:id - Delete a check record.
 */
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.dbConnected || id.startsWith('mem_')) {
      inMemoryHistory = inMemoryHistory.filter(i => i._id !== id);
      return res.status(200).json({ success: true, message: 'Record deleted.' });
    }

    const deleted = await CheckHistory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Record not found.' });
    }

    return res.status(200).json({ success: true, message: 'Record deleted.' });
  } catch (error) {
    console.error('Error deleting history item:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete record.' });
  }
};

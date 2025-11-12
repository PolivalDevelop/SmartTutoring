const Report = require('../models/reportModel');
const User = require('../models/userModel');

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { reporter, reportedUser, reason, details } = req.body;

    if (!reporter || !reportedUser || !reason || !details) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    if (reporter === reportedUser) {
      return res.status(400).json({ message: 'A user cannot report themselves.' });
    }

    const newReport = new Report({
      reporter,
      reportedUser,
      reason,
      details,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error });
  }
};

// Get a single report by ID
exports.getReportByProductId = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'firstName lastName email')
      .populate('reportedUser', 'firstName lastName email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error });
  }
};

// Delete a report by ID
exports.deleteReport = async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);

    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error });
  }
};

// Get all reports for a specific user (by username)
exports.getAllUserReport = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reports = await Report.find({ reportedUser: user._id })
      .populate('reporter', 'firstName lastName email')
      .populate('reportedUser', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reports', error });
  }
};

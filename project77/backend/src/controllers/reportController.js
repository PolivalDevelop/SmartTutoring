// reportController.js (versione Socket.io)

const Report = require("../models/reportModel");
const User = require("../models/userModel");

// --------------------------------------------------
// CREATE REPORT
// --------------------------------------------------
exports.createReportSocket = async (data) => {
  const { reporter, reportedUser, reason, details } = data;

  if (!reporter || !reportedUser || !reason || !details) {
    throw new Error("All required fields must be provided.");
  }

  if (reporter === reportedUser) {
    throw new Error("A user cannot report themselves.");
  }

  const newReport = new Report({
    reporter,
    reportedUser,
    reason,
    details,
  });

  return await newReport.save();
};

// --------------------------------------------------
// GET REPORT BY ID
// --------------------------------------------------
exports.getReportByProductIdSocket = async (id) => {
  const report = await Report.findById(id)
    .populate("reporter", "firstName lastName email")
    .populate("reportedUser", "firstName lastName email");

  if (!report) {
    throw new Error("Report not found");
  }

  return report;
};

// --------------------------------------------------
// DELETE REPORT BY ID
// --------------------------------------------------
exports.deleteReportSocket = async (id) => {
  const deleted = await Report.findByIdAndDelete(id);

  if (!deleted) {
    throw new Error("Report not found");
  }

  return { message: "Report successfully deleted" };
};

// --------------------------------------------------
// GET ALL REPORTS FOR A USER (by username)
// --------------------------------------------------
exports.getAllUserReportSocket = async (username) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("User not found");
  }

  const reports = await Report.find({ reportedUser: user._id })
    .populate("reporter", "firstName lastName email")
    .populate("reportedUser", "firstName lastName email")
    .sort({ createdAt: -1 });

  return reports;
};

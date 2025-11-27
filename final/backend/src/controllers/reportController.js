// reportController.js (versione Socket.io)

const Report = require("../models/reportModel");
const User = require("../models/userModel");
// --------------------------------------------------
// CREATE REPORT
// --------------------------------------------------
exports.createReportSocket = async (data) => {
  const { reporter, reported, reason, comment, createdAt } = data;

  if (!reporter || !reported || !reason || !comment || !createdAt) {
    throw new Error("All required fields must be provided.");
  }

  if (reporter == reported) {
    throw new Error("A user cannot report themselves.");
  }

  const newReport = new Report({
    reporter,
    reported,
    reason,
    comment,
    createdAt,
  });

  return await newReport.save();
};


// --------------------------------------------------
// GET REPORT BY ID
// --------------------------------------------------
exports.getReportByIdSocket = async (emailAdmin, id) => {
  const admin = await Admin.findOne({ emailAdmin });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const report = await Report.findById(id);

  if (!report) {
    throw new Error("Report not found");
  }

  return report;
};

// --------------------------------------------------
// DELETE REPORT BY ID
// --------------------------------------------------
exports.deleteReportSocket = async (emailAdmin, id) => {
  const admin = await Admin.findOne({ emailAdmin });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const deleted = await Report.findByIdAndDelete(id);

  if (!deleted) {
    throw new Error("Report not found");
  }

  return { message: "Report successfully deleted" };
};

// --------------------------------------------------
// GET ALL REPORTS FOR A USER (by username)
// --------------------------------------------------
exports.getAllUserReportsSocket = async (emailAdmin, username) => {
  const admin = await Admin.findOne({ emailAdmin });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const reports = await Report.find({ reported: username })
    .sort({ createdAt: -1 });

  return reports;
};

exports.getOpenReportsSocket = async (emailAdmin) => {
  const admin = await Admin.findOne({ emailAdmin });
  if (!admin) {
    throw new Error("Admin not found");
  } 
  const reports = await Report.find({ status: "open" })
    .sort({ createdAt: -1 });
  return reports;
};

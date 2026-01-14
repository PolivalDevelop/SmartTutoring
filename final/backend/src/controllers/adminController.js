
Admin = require("../models/adminModel");


exports.checkAdminSocket = async (emailAdmin) => {
  const admin = await Admin.findOne({ emailAdmin: emailAdmin });
  if (!admin) {
    throw new Error("Admin not found " + emailAdmin );
  }
  return true;
}
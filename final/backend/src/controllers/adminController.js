
Admin = require("../models/adminModel");

// ----------------------------------------
// CHECK ADMIN EXISTS
// ----------------------------------------

exports.checkAdminSocket = async (emailAdmin) => {
  const admin = await Admin.findOne({ emailAdmin });
  if (!admin) {
    throw new Error("Admin not found");
  }
  return true;
}
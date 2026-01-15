const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: String,    
      required: true,
      trim: true,
    },
    reported: {
      type: String,      
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "contenuti-inappropriati",
        "linguaggio-offensivo",
        "comportamento-scorretto",
        "spam-pubblicita",
        "altro",
      ],
    },

    comment: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },

    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

reportSchema.pre("save", function (next) {
  if (this.reporter !== this.reportedUser) {
    next();
  } else {
    next(new Error("A user cannot report themselves."));
  }
});

module.exports = mongoose.model("Report", reportSchema);

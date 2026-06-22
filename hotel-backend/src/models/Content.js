const mongoose = require("mongoose");

const contentItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

contentItemSchema.statics.get = async function get(key, fallback = []) {
  const doc = await this.findOne({ key });
  return doc ? doc.items : fallback;
};

contentItemSchema.statics.set = async function set(key, items) {
  return this.findOneAndUpdate(
    { key },
    { $set: { items } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = mongoose.model("Content", contentItemSchema);
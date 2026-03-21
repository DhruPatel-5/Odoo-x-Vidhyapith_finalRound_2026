/**
 * Seed script: Inserts the 3 default ECO stages into MongoDB.
 * Run once after first startup: node seed.js
 */
require('dotenv').config();
require('express-async-errors');
const mongoose = require('mongoose');
const ECOStage = require('./models/ECOStage');
const { DEFAULT_STAGES } = require('./config/constants');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const count = await ECOStage.countDocuments();
  if (count > 0) {
    console.log(`Stages already seeded (${count} found). Skipping.`);
    process.exit(0);
  }

  await ECOStage.insertMany(DEFAULT_STAGES);
  console.log('✅ Default stages seeded:', DEFAULT_STAGES.map((s) => s.name).join(', '));
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const masterBMISchema = new Schema(
	{
		referenceMin: Number,
		referenceMax: Number,
		category: String,
		group: String,
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model('masterBMI', masterBMISchema);

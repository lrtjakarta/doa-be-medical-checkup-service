const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const usersSchema = new Schema(
	{
		profile: Object,
		dailyWorkOrder: Object,
		mrNumber: String,
		head_id: String,
		retake: String,
		soap: Object,
		mrData: Array,
		note: String,
		status: String,
		retake1At: Date,
		retake2At: Date,
		checkup1At: Date,
		checkup2At: Date,
		finishAt: Date,
		createBy: Object,
		changeDate: Date,
		changeData: Object,
		history: Array,
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model('checkup', usersSchema);

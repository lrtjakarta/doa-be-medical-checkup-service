const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const monthlySchema = new Schema({
    monthly : String, // 2024-07 
    profile : Object,
    age : {year: Number, month: Number, day: Number},
    height : String,
    weight : String,
    fat : String, //Number
    vfa : String, //Number
    bmr : String, //Number
    bmi : String, //Number
    bmiReference: Object, //Mapping dari Master Data BMI,
    note: String,
    createBy:Object
},
{
    timestamps:true
}
); 
module.exports = mongoose.model('monthly', monthlySchema);
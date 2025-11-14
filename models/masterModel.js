const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const masterMedicalSchema = new Schema({
    name:String,
    soal_id : String,
    unit : Object,
    category : Object,
    answerType: String,
    index:Number,
    reference : {
        min: String,
        max: String
    },
    createBy:Object,
    categoryField: String
},
{
    timestamps:true
}
); 
module.exports = mongoose.model('master', masterMedicalSchema);
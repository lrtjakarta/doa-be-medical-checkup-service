const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const masterMedicalSchema = new Schema({
    code:String,
    name:String,
    createBy:Object
},
{
    timestamps:true
}
); 
module.exports = mongoose.model('diagnosis', masterMedicalSchema);
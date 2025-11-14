const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const masterMedicalSchema = new Schema({
    medicine:String,
    dosage:String,
    qty:String,
    createBy:Object
},
{
    timestamps:true
}
); 
module.exports = mongoose.model('pharmacology', masterMedicalSchema);
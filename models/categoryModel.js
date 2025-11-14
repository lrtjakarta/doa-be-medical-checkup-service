const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const usersSchema = new Schema({
    name : String,
    note : String,
    createBy: Object
},
{
    timestamps:true
}
); 
module.exports = mongoose.model('category', usersSchema);
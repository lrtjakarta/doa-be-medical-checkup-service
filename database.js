// var databaseURI = 'mongodb://localhost/AkdaMedicalDb'
// var databaseURI = 'mongodb://faiz:faiz@172.16.27.7:27017/AkdaMedicalDb' // windows server
require("dotenv").config();
var databaseURI = process.env.DATABASE_URI;
console.log("databaseURI", databaseURI);
module.exports = {
  mongoURI: databaseURI,
  secretOrKey: "nahdude",
};

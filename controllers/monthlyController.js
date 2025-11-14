const monthlyModel = require('../models/monthlyModel')
const { default: mongoose } = require('mongoose')

exports.get = function (req, res, next) {
    const { id, trainDriverId, date, monthly } = req.query
    let query = {}
    if(id){
        query = {...query,_id:mongoose.Types.ObjectId(id)}
    }
    if(trainDriverId){
        query = {...query,"trainDriver._id":trainDriverId}
    }
    if(date){
        query = {...query, createAtString: date}
    }
    if(monthly){
        query = {...query, monthly}
    }
    console.log('query', query)
    monthlyModel.aggregate([
        {
            $addFields:{ "createAtString": { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "+07:00" } },}
        },
        {$match:query}], (err, result) => {
        if (err) {
            next()
        }
        else {
            res.status(200).json(result)
        }
    })
}

exports.create = function (req, res, next) {
    var new_data = new monthlyModel(req.body);
    new_data.save(function(err, data) {
        if (err){
            next(err);
        }
        else{
            res.status(200).json(data);
        }
    });
}

exports.update = function (req, res, next) {
    monthlyModel.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true }, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}

exports.delete = function (req, res, next) {
    monthlyModel.findOneAndDelete({ _id: req.params._id }, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}
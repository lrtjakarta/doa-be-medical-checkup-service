const mrModel = require('../models/masterModel')

exports.get = function (req, res, next) {
    const { id } = req.query
    let query = {}
    if(id){
        query = {...query,_id:id}
    }

    mrModel.find(query, (err, result) => {
        if (err) {
            next()
        }
        else {
            res.status(200).json(result)
        }
    }).sort({index:1})
}

exports.create = function (req, res, next) {
    var new_data = new mrModel(req.body);
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
    mrModel.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true }, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}

exports.delete = function (req, res, next) {
    mrModel.findOneAndDelete({ _id: req.params._id }, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}
const categoryModel = require('../models/categoryModel')

exports.get = function (req, res, next) {
    const { id } = req.query
    let query = {}
    if(id){
        query = {...query,_id:id}
    }

    categoryModel.find(query, (err, result) => {
        if (err) {
            next()
        }
        else {
            res.status(200).json(result)
        }
    })
}

exports.create = function (req, res, next) {
    var new_data = new categoryModel(req.body);
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
    categoryModel.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true }, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}

exports.delete = function (req, res, next) {
    categoryModel.findOneAndDelete({ _id: req.params._id }, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}
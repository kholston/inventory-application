var Manufacturer = require('../models/manufacturer');
var Item = require("../models/item");

var async = require('async');

exports.manufacturer_list = function(req, res, next) {
  Manufacturer.find()
    .populate('manufacturer')
    .sort([
      ['name', 'ascending']
    ])
    .exec(function(err, list_manufacturers) {
      if (err) { return next(err); }
      res.render('manufacturer_list', { title: "Manufacturer List", manufacturer_list: list_manufacturers })
    })
};
exports.manufacturer_detail = function(req, res, next) {
  async.parallel({
    manufacturer: function(callback) {
      Manufacturer.findById(req.params.id).exec(callback);
    },
    manufacturer_items: function(callback) {
      Item.find({ manufacturer: req.params.id }, 'name description').exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err) }
    if (results.manufacturer == null) {
      var err = new Error('Manufacturer not found.');
      err.status = 404;
      return next(err);
    }
    res.render('manufacturer_detail', { title: "Manufacturer Detail", manufacturer: results.manufacturer, manufacturer_items: results.manufacturer_items })
  });
};
exports.manufacturer_create_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Manufacturer create GET");
};
exports.manufacturer_create_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Manufacturer create POST");
};
exports.manufacturer_delete_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Manufacturer delete GET");
};
exports.manufacturer_delete_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Manufacturer delete POST");
};
exports.manufacturer_update_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Manufacturer update GET");
};
exports.manufacturer_update_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Manufacturer update POST");
};

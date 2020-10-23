var Item = require('../models/item');
var Manufacturer = require("../models/manufacturer");
var Category = require("../models/category");
var ItemInstance = require("../models/iteminstance");

var async = require("async");


exports.index = function(req, res) {
  async.parallel({
    item_count: function(callback) {
      Item.countDocuments({}, callback);
    },
    item_in_stock_count: function(callback) {
      Item.countDocuments({ number_in_stock: { $gt: 0 } }, callback)
    },
    manufacturer_count: function(callback) {
      Manufacturer.countDocuments({}, callback);
    },
    category_count: function(callback) {
      Category.countDocuments({}, callback);
    },
    item_instance_count: function(callback) {
      ItemInstance.countDocuments({}, callback)
    }
  }, function(err, results) {
    res.render('index', { title: "Music Store Inventory", error: err, data: results })
  });
};

exports.item_list = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Item List");
};
exports.item_detail = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Item Detail: " + req.params.id);
};
exports.item_create_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Item create GET");
};
exports.item_create_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Item create POST");
};
exports.item_delete_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Item delete GET");
};
exports.item_delete_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Item delete POST");
};
exports.item_update_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Item update GET");
};
exports.item_update_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Item update POST");
};

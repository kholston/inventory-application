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
  Item.find({}, 'manufacturer name')
    .populate('manufacturer')
    .exec(function(err, list_items) {
      if (err) { return next(err); }
      res.render('item_list', { title: "Item List", item_list: list_items })
    })
};
exports.item_detail = function(req, res, next) {
  async.parallel({
    item: function(callback) {
      Item.findById(req.params.id)
        .populate("manufacturer")
        .populate('category')
        .exec(callback);
    },
    item_instance: function(callback) {
      ItemInstance.find({ "item": req.params.id }).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.item == null) {
      var err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    res.render('item_detail', { title: `${results.item.manufacturer.name} ${results.item.name}`, item: results.item, item_instances: results.item_instance })
  })

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

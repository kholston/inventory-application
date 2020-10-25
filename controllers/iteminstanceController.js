var ItemInstance = require('../models/iteminstance');
var Item = require('../models/item');

var async = require("async");

exports.iteminstance_list = function(req, res, next) {
  ItemInstance.find()
    .populate('item')
    .exec(function(err, list_item_instances) {
      if (err) { return next(err); }
      res.render('iteminstance_list', { title: "Item Instance List", iteminstance_list: list_item_instances });
    })
};
exports.iteminstance_detail = function(req, res, next) {
  async.parallel({
    item_instance: function(callback) {
      ItemInstance.findById(req.params.id)
        .populate("item")
        .exec(function(err, item_instance) {
          if (err) { return next(err); }
          if (item_instance == null) {
            var err = new Error("Item Instance not found")
            err.status = 404;
            return next(err);
          }
          res.render("iteminstance_detail", { title: " Item Detail: " + item_instance.item.name, iteminstance: item_instance })
        })
    }
  });
};
exports.iteminstance_create_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: ItemInstance create GET");
};
exports.iteminstance_create_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: ItemInstance create POST");
};
exports.iteminstance_delete_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: ItemInstance delete GET");
};
exports.iteminstance_delete_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: ItemInstance delete POST");
};
exports.iteminstance_update_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: ItemInstance update GET");
};
exports.iteminstance_update_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: ItemInstance update POST");
};

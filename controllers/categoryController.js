var Category = require('../models/category');
var Item = require('../models/item');

var async = require("async");

exports.category_list = function(req, res, next) {
  Category.find()
    .populate('category')
    .sort([
      ["name ascending"]
    ])
    .exec(function(err, list_categories) {
      if (err) { return next(err) }
      res.render("category_list", {
        title: 'Category List',
        category_list: list_categories
      });
    });
};
exports.category_detail = function(req, res, next) {
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id)
        .exec(callback);
    },

    category_items: function(callback) {
      Item.find({ category: req.params.id }, 'name description')
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err) }
    if (results.category == null) {
      var err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    res.render("category_detail", { title: "Category Detail", category: results.category, category_items: results.category_items });
  })
};
exports.category_create_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Category create GET");
};
exports.category_create_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Category create POST");
};
exports.category_delete_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Category delete GET");
};
exports.category_delete_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Category delete POST");
};
exports.category_update_get = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Category update GET");
};
exports.category_update_post = function(req, res, next) {
  res.send("NOT IMPLEMENTED: Category update POST");
};

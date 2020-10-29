var Item = require('../models/item');
var Manufacturer = require("../models/manufacturer");
var Category = require("../models/category");
var ItemInstance = require("../models/iteminstance");

var async = require("async");
const { body, validationResult } = require('express-validator');


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
  async.parallel({
    manufacturers: function(callback) {
      Manufacturer.find(callback);
    },
    categories: function(callback) {
      Category.find(callback);
    }
  }, function(err, results) {
    if (err) { return next(err) }
    res.render('item_form', { title: "Create Item", manufacturers: results.manufacturers, categories: results.categories })
  })
};
exports.item_create_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category == "undefined") req.body.category = []
      else req.body.category = new Array(req.body.category)
    }
    next();
  },
  body('name', 'Item name must not be empty').trim().isLength({ min: 1 }).escape(),
  body('manufacturer', "Manufacturer name must not be empty").trim().isLength({ min: 1 }).escape(),
  body('description', 'Item Description must not be empty').trim().isLength({ min: 1 }).escape(),
  body('price', 'Item price must not be empty').trim().isLength({ min: 1 }).escape(),
  body('category.*').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var item = new Item({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: 0,
      category: req.body.category
    })

    if (!errors.isEmpty()) {
      async.parallel({
        manufacturers: function(callback) {
          Manufacturer.find(callback);
        },
        categories: function(callback) {
          Category.find(callback);
        }
      }, function(err, results) {
        if (err) { return next(err) }
        for (let i = 0; i < results.categories.length; i++) {
          if (item.category.indexOf(results.categories[i]._id) > -1) {
            results.categories[i].checked = "true"
          }
        }
        res.render('item_form', { title: "Create Item", manufacturers: results.manufacturers, categories: results.categories, item: item, errors: errors.array() })
      })
      return;
    }
    else {
      item.save(function(err) {
        if (err) { return next(err) }
        res.redirect(item.url);
      })
    }
  }
];
exports.item_delete_get = function(req, res, next) {
  async.parallel({
    item: function(callback){
      Item.findById(req.params.id)
      .populate('manufacturer')
      .populate('category')
      .exec(callback);
    },
    item_iteminstances: function(callback){
      ItemInstance.find({'item':req.params.id}).exec(callback);
    }
  }, function(err,results){
    if(err){return next(err);}
    if(results.item==null){
      res.redirect('/inventory/items');
    }
    res.render('item_delete', {title: 'Delete Item', item: results.item, item_instances:results.item_iteminstances});
  });
};
exports.item_delete_post = function(req, res, next) {
  async.parallel({
    item: function(callback){
      Item.findById(req.params.id)
      .populate('manufacturer')
      .populate('category')
      .exec(callback);
    },
    item_iteminstances: function(callback){
      ItemInstance.find({'item':req.params.id}).exec(callback);
    }
  }, function(err,results){
    if(err){return next(err);}
    if(results.item_iteminstances > 0){
      res.render('item_delete',{title: 'Delete Item', item: results.item, item_instances:results.item_iteminstances})
      return;
    }
    else {
      Item.findByIdAndRemove(req.body.id, function deleteItem(err){
        if(err){ return next(err)};
        res.redirect('/inventory/items');
      })
    }
  });
};
exports.item_update_get = function(req, res, next) {
  async.parallel({
    item: function(callback){
      Item.findById(req.params.id)
      .populate('manufacturer')
      .populate('category')
      .exec(callback);
    },
    manufacturers: function(callback){
      Manufacturer.find(callback)
    },
    categories: function(callback){
      Category.find(callback)
    }
  }, function(err, results){
      if(err){return next(err);}
      if(results.item==null){
        var err = new Error('Item not found');
        err.status = 404;
        return next(err);
      }
      for(var all_c_iter = 0; all_c_iter < results.categories.length; all_c_iter++ ){
        for(var item_c_iter = 0; item_c_iter < results.item.category.length; item_c_iter++){
          if(results.categories[all_c_iter]._id.toString()==results.item.category[item_c_iter]._id.toString()){
            results.categories[all_c_iter].checked='true';
          }
        }
      }
      res.render('item_form', {title: 'Update Item', manufacturers:results.manufacturers, categories:results.categories, item:results.item})
  });
};
exports.item_update_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category == "undefined") req.body.category = []
      else req.body.category = new Array(req.body.category)
    }
    next();
  },
  body('name', 'Item name must not be empty').trim().isLength({ min: 1 }).escape(),
  body('manufacturer', "Manufacturer name must not be empty").trim().isLength({ min: 1 }).escape(),
  body('description', 'Item Description must not be empty').trim().isLength({ min: 1 }).escape(),
  body('price', 'Item price must not be empty').trim().isLength({ min: 1 }).escape(),
  body('category.*').trim().isLength({ min: 1 }).escape(),

  (req,res,next)=>{
    const errors = validationResult(req);

    var item = new Item({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      async.parallel({
        manufacturers: function(callback) {
          Manufacturer.find(callback);
        },
        categories: function(callback) {
          Category.find(callback);
        }
      }, function(err, results) {
        if (err) { return next(err) }
        for (let i = 0; i < results.categories.length; i++) {
          if (item.category.indexOf(results.categories[i]._id) > -1) {
            results.categories[i].checked = "true"
          }
        }
        res.render('item_form', { title: "Update Item", manufacturers: results.manufacturers, categories: results.categories, item: item, errors: errors.array() })
      })
      return;
    }
    else {
      Item.findByIdAndUpdate(req.params.id, item,{},function(err, theitem){
        if(err){ return next(err) };
        res.redirect(theitem.url);
      })
    }
  }

  
];

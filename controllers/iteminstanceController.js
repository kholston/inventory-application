var ItemInstance = require('../models/iteminstance');
var Item = require('../models/item');

var async = require("async");

const { body, validationResult } = require('express-validator');
const iteminstance = require('../models/iteminstance');

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
  Item.find({},'name')
  .exec(function (err, items){
    if(err){ return next(err);}
    res.render('iteminstance_form',{title:'Create Item Instance', item_list: items})
  })
};
exports.iteminstance_create_post = [
  body('item',' Item must be specified').trim().isLength({min: 1}).escape(),
  body('serial_number','Serial Number must be specified').trim().isLength({min: 1}).escape(),

  (req,res,next)=>{
    const errors = validationResult(req);

    var iteminstance = new ItemInstance(
      {
        item: req.body.item,
        serial_number: req.body.serial_number
      }
    );

    if(!errors.isEmpty()){
      Item.find({},'name')
          .exec(function (err, items){
              if(err){ return next(err);}
              res.render('iteminstance_form',{title:'Create Item Instance', item_list: items, selected_item: iteminstance.item._id ,errors:errors.array(), iteminstance:iteminstance})
      })
      return;
    }
    else {
      iteminstance.save(function(err){
        if(err){return next(err);}
        res.redirect(iteminstance.url);
      })
    }
  }
];
exports.iteminstance_delete_get = function(req, res, next) {
  ItemInstance.findById(req.params.id)
    .populate('item')
    .exec(function(err, iteminstance){
      if(err){return next(err);}
      if(iteminstance==null){
        res.redirect('/inventory/iteminstances');
      }
      res.render('iteminstance_delete',{title:'Delete Item Instance', iteminstance: iteminstance});
    })
};
exports.iteminstance_delete_post = function(req, res, next) {
  ItemInstance.findByIdAndRemove(req.body.id, function deleteItemInstance(err){
      if(err){return next(err);}
      res.redirect('/inventory/iteminstances');
  })
};
exports.iteminstance_update_get = function(req, res, next) {
  async.parallel({
    iteminstance : function(callback){
      ItemInstance.findById(req.params.id)
        .populate('item')
        .exec(callback)
    },
    items: function(callback){
      Item.find(callback)
    }
  }, function(err, results){
      if(err){return next(err);}
      if(results.iteminstance==null){
        var err = new Error('Item Instance not found');
        err.status = 404;
        return next(err);
      }
      res.render('iteminstance_form', {title: 'Update Item Instance', item_list: results.items, selected_item: results.iteminstance.item._id, iteminstance:results.iteminstance});
  });
};
exports.iteminstance_update_post = [
  body('item',' Item must be specified').trim().isLength({min: 1}).escape(),
  body('serial_number','Serial Number must be specified').trim().isLength({min: 1}).escape(),

  (req,res,next) =>{
    const errors = validationResult(req);

    var iteminstance = new ItemInstance(
      {
        item: req.body.item,
        serial_number: req.body.serial_number,
        _id: req.params.id
      }
    );

    if(!errors.isEmpty()){
      Item.find({},'name')
        .exec(function(err, items){
          if(err){return next(err);}
          res.render('iteminstance_form', {title: 'Update Item Instance', item_list: results.items, selected_item: results.iteminstance.item._id, iteminstance:iteminstance});
        })
        return;
    }
    else {
      ItemInstance.findByIdAndUpdate(req.params.id, iteminstance,{},function(err, theiteminstance){
        if(err){return next(err);}
          res.redirect(theiteminstance.url);
      })
    }
  }
];

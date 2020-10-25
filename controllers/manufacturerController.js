var Manufacturer = require('../models/manufacturer');
var Item = require("../models/item");

var async = require('async');
var { body, validationResult } = require("express-validator");

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
  res.render('manufacturer_form', { title: "Create Manufacturer" });
};
exports.manufacturer_create_post = [
  body('name', 'Manufacturer name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Manufacturer description required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    var errors = validationResult(req);
    var manufacturer = new Manufacturer({ name: req.body.name, description: req.body.description });

    if (!errors.isEmpty()) {
      res.render('manufacturer_form', {
        title: 'Create Manufacturer',
        manufacturer: manufacturer,
        errors: errors.Array()
      })
      return;
    }
    else {
      Manufacturer.findOne({ name: req.body.name }).exec(function(err, found_manufacturer) {
        if (err) { return next(err) }
        if (found_manufacturer) {
          res.redirect(found_manufacturer.url);
        }
        else {
          manufacturer.save(function(err) {
            if (err) { return next(err) }
            res.redirect(manufacturer.url)
          })
        }
      })
    }
  }
];

exports.manufacturer_delete_get = function(req, res, next) {
  async.parallel({
    manufacturer: function(callback) {
      Manufacturer.findById(req.params.id).exec(callback);
    },
    manufacturer_items: function(callback) {
      Item.find({ 'manufacturer': req.params.id }).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err) }
    if (results.manufacturer == null) {
      res.redirect('/inventory/manufacturers');
    }
    res.render('manufacturer_delete', { title: "Delete Manufacturer", manufacturer: results.manufacturer, manufacturer_items: results.manufacturer_items });
  })
};
exports.manufacturer_delete_post = function(req, res, next) {
  async.parallel({
    manufacturer: function(callback) {
      Manufacturer.findById(req.params.id).exec(callback);
    },
    manufacturer_items: function(callback) {
      Item.find({ 'manufacturer': req.params.id }).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err) }
    if (results.manufacturer_items.length > 0) {
      res.render('manufacturer_delete', { title: "Delete Manufacturer", manufacturer: results.manufacturer, manufacturer_items: results.manufacturer_items });
      return;
    }
    else {
      Manufacturer.findByIdAndRemove(req.body.id, function deleteManufacturer(err) {
        if (err) { return next(err) }
        res.redirect('/inventory/manufacturers');
      })
    }
  })
};
exports.manufacturer_update_get = function(req, res, next) {
  Manufacturer.findById(req.params.id, function(err, manufacturer) {
    if (err) { return next(err) }
    if (manufacturer == null) {
      var err = new Error('Manufacturer not found');
      err.status = 404;
      return next(err);
    }
    res.render('manufacturer_form', { title: 'Update Manufacturer', manufacturer: manufacturer })
  })
};
exports.manufacturer_update_post = [
  body('name', 'Manufacturer name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Manufacturer description required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    var errors = validationResult(req);
    var manufacturer = new Manufacturer({ _id: req.params.id, name: req.body.name, description: req.body.description });

    if (!errors.isEmpty()) {
      res.render('manufacturer_form', {
        title: 'Update Manufacturer',
        manufacturer: manufacturer,
        errors: errors.Array()
      })
      return;
    }
    else {
      Manufacturer.findByIdAndUpdate(req.params.id, manufacturer, {}, function(err, themanufacturer) {
        if (err) { return next(err) }
        res.redirect(themanufacturer.url);
      })

    }
  }
];

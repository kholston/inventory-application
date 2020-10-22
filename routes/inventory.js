var express = require('express');
var router = express.Router();

// import controller modules
var item_controller = require('../controllers/itemController');
var manufacturer_controller = require('../controllers/manufacturerController');
var category_controller = require('../controllers/categoryController');
var item_instance_controller = require('../controllers/iteminstanceController');

/// Item Routes ///
router.get('/', item_controller.index);

router.get('/item/create',item_controller.item_create_get);

router.post('/item/create',item_controller.item_create_post);

router.get('/item/:id/delete',item_controller.item_delete_get);

router.post('/item/:id/delete',item_controller.item_delete_post);

router.get('/item/:id/update',item_controller.item_update_get);

router.post('/item/:id/update',item_controller.item_update_post);

router.get('/item/:id',item_controller.item_detail);

router.get('/items',item_controller.item_list);

/// Manufacturer Routes ///

router.get('/manufacturer/create',manufacturer_controller.manufacturer_create_get);

router.post('/manufacturer/create',manufacturer_controller.manufacturer_create_post);

router.get('/manufacturer/:id/delete',manufacturer_controller.manufacturer_delete_get);

router.post('/manufacturer/:id/delete',manufacturer_controller.manufacturer_delete_post);

router.get('/manufacturer/:id/update',manufacturer_controller.manufacturer_update_get);

router.post('/manufacturer/:id/update',manufacturer_controller.manufacturer_update_post);

router.get('/manufacturer/:id',manufacturer_controller.manufacturer_detail);

router.get('/manufacturers',manufacturer_controller.manufacturer_list);

/// Category Routes ///

router.get('/category/create',category_controller.category_create_get);

router.post('/category/create',category_controller.category_create_post);

router.get('/category/:id/delete',category_controller.category_delete_get);

router.post('/category/:id/delete',category_controller.category_delete_post);

router.get('/category/:id/update',category_controller.category_update_get);

router.post('/category/:id/update',category_controller.category_update_post);

router.get('/category/:id',category_controller.category_detail);

router.get('/categories',category_controller.category_list);

/// ItemInstance Routes ///

router.get('/iteminstance/create',item_instance_controller.iteminstance_create_get);

router.post('/iteminstance/create',item_instance_controller.iteminstance_create_post);

router.get('/iteminstance/:id/delete',item_instance_controller.iteminstance_delete_get);

router.post('/iteminstance/:id/delete',item_instance_controller.iteminstance_delete_post);

router.get('/iteminstance/:id/update',item_instance_controller.iteminstance_update_get);

router.post('/iteminstance/:id/update',item_instance_controller.iteminstance_update_post);

router.get('/iteminstance/:id',item_instance_controller.iteminstance_detail);

router.get('/iteminstances',item_instance_controller.iteminstance_list);


module.exports = router;
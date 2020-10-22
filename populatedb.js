#! /usr/bin/env node
require('dotenv').config();
console.log('This script populates some test items, manufacturers, categories and iteminstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.env.DB_HOST;
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Manufacturer = require('./models/manufacturer')
var Category = require('./models/category')
var ItemInstance = require('./models/iteminstance')


var mongoose = require('mongoose');
var mongoDB = userArgs;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var manufacturers = []
var categories = []
var items = []
var iteminstances = []

function manufacturerCreate(name, description, cb) {
  manufacturerdetail = {name:name , description: description }

  var manufacturer = new Manufacturer(manufacturerdetail);
       
  manufacturer.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Manufacturer: ' + manufacturer);
    manufacturers.push(manufacturer)
    cb(null, manufacturer)
  }  );
}

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name, description: description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function itemCreate(name, description, category, price, number_in_stock, manufacturer, cb) {
  itemdetail = { 
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
    manufacturer: manufacturer
  }
    
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}


function itemInstanceCreate(item, serial_number, cb) {
  iteminstancedetail = { 
    item: item,
    serial_number: serial_number
  }    
    
  var iteminstance = new ItemInstance(iteminstancedetail);    
  iteminstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING ItemInstance: ' + iteminstance);
      cb(err, null)
      return
    }
    console.log('New ItemInstance: ' + iteminstance);
    iteminstances.push(iteminstance)
    cb(null, item)
  }  );
}

// manufacturerCreate(name, description, cb) 
// categoryCreate(name, description, cb)

function createCategoryManufacturers(cb) {
    async.series([
        function(callback) {
          manufacturerCreate('Fender', 'American manufacturer of stringed instruments and amplifiers',callback);
        },
        function(callback) {
          manufacturerCreate('Korg', 'Japanese electronic musical instrument manufacturer', callback);
        },
        function(callback) {
          manufacturerCreate('Elektron', 'Swedish developer and manufacturer of musical instruments', callback);
        },
        function(callback) {
          manufacturerCreate('Roland', 'Japanese manufacturer of electronic instruments, electronic equipment, and software', callback);
        },
        function(callback) {
          manufacturerCreate('Shure', 'American audio products corporation', callback);
        },
        function(callback) {
          categoryCreate("Guitars", "Fretted musical string instruments", callback);
        },
        function(callback) {
          categoryCreate("Synthesizers", "Electronic musical instruments that generate audio signals.", callback);
        },
        function(callback) {
          categoryCreate("Microphones", "Devices - tranducers - that convert sound into electrical signals.", callback);
        },
        function(callback) {
          categoryCreate("Samplers","Electronic or digital musical instrument that uses sound recordings to create music.", callback)
        }
        ],
        // optional callback
        cb);
}

// itemCreate(name, description, category, price, number_in_stock, manufacturer, cb)
function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Player Statocaster Electric Guitar', 'Fender Player guitar with 2-point tremolo system, a maple neck, and Alnico 5 pickups', categories[0], "699.99", 2, manufacturers[0], callback);
        },
        function(callback) {
          itemCreate("American Pro Stratocaster Electric Guitar (with case)", 'Fender American Pro guitar with rosewood fingerboard and a trio of mixed-alnico V-Mod single-coil pickups ', categories[0], "1449.99", 3, manufacturers[0], callback);
        },
        function(callback) {
          itemCreate("KROSS 2 Keyboard Synthesizer Workstation, 61 key", 'A cross between a performance synth and a production workstation with 1075 presets and a sequencer', categories[1], "799.99", 2, manufacturers[1] ,callback);
        },
        function(callback) {
          itemCreate("Digitakt", "A drum machine, sampler, and sequencer with 8 audio tracks and 8 midi tracks.", categories[3], "799.99", 1, manufacturers[2] , callback);
        },
        function(callback) {
          itemCreate("GO:KEYS Music Creation Keyboard","A battery powered synth with 500+ sounds, 600+ looped phrases and performance pads", categories[1], "329.99", 2, manufacturers[3], callback);
        },
        function(callback) {
          itemCreate('SP-404A Linear Wave Sampler ', 'A portable linear wave sampler with built-in mics and mic/line inputs.', categories[3], "549.99", 1, manufacturers[3], callback);
        },
        function(callback) {
          itemCreate('SM57 Cardioid Dynamic Microphone', 'An industry standard microphone for live sound or studio recording', categories[2], "99.99", 0, manufacturers[4], callback)
        }
        ],
        // optional callback
        cb);
}

//itemInstanceCreate(item, serial_number, cb)
function createItemInstances(cb) {
    async.parallel([
        function (callback){
          itemInstanceCreate(items[0] , "2516854954", callback);          
        },
        function (callback){
          itemInstanceCreate( items[0], "6985764351", callback);
        },
        function (callback){
          itemInstanceCreate( items[1], "564GD65484", callback);
        },
        function (callback){
          itemInstanceCreate( items[1], "658DG66985", callback);
        },
        function (callback){
          itemInstanceCreate( items[1], "846ER65496", callback);
        },
        function (callback){
          itemInstanceCreate( items[2], "RTY5795424", callback);
        },
        function (callback){
          itemInstanceCreate( items[2], "WSD5884646", callback);
        },
        function (callback){
          itemInstanceCreate( items[3], "ORTJF-54896", callback);
        },
        function (callback){
          itemInstanceCreate( items[4], "POI456", callback);
        },
        function (callback){
          itemInstanceCreate( items[4], "TDS528", callback);
        },
        function (callback){
          itemInstanceCreate( items[5], "POIU96325745", callback);
        },
        ],
        // Optional callback
        cb);
}



async.series([
    createCategoryManufacturers,
    createItems,
    createItemInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ITEMInstances: '+iteminstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});





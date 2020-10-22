var mongoose = require('mongoose');

var Schema = mongoose.Schema

var ManufacturerSchema = new Schema(
  {
    name: {type: String, required: true, minlength:3, maxlength: 100 },
    description:{type: String, required: true, minlength:3, maxlength: 100 }
  }
);

ManufacturerSchema
  .virtual('url')
  .get(function(){
    return '/inventory/manufacturer/' + this._id;
  });

module.exports = mongoose.model('Manufacturer',ManufacturerSchema);
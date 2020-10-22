var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100}  ,
    description: {type: String, required: true, maxlength: 100} ,
    category: [{type: Schema.Types.ObjectId, ref:"Category", required: true}],
    price: {type: String, required: true, minlength:4,maxlength: 14},
    number_in_stock: {type: Number, required:true, min:0},
    manufacturer: {type: Schema.Types.ObjectId, ref:"Manufacturer", required:true }
  }
);

ItemSchema
  .virtual('url')
  .get(function(){
    return '/inventory/item/' + this._id;
  });

module.exports = mongoose.model('Item',ItemSchema);
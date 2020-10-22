var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemInstanceSchema = new Schema(
  {
    item:{type: Schema.Types.ObjectId, ref:'Item', required:true },
    serial_number:{type: String, required:true }
  }
);

ItemInstanceSchema
  .virtual('url')
  .get(function(){
    return '/inventory/iteminstance/' + this._id;
  });

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);
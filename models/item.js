const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
});

ItemSchema.virtual('url').get(function () {
  return '/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);

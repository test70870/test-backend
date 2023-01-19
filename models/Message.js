let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');

const messageSchema = Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String
  },
}, { timestamps: true });

messageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Message', messageSchema);

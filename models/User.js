let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let jwt = require('jsonwebtoken');
let mongoosePaginate = require('mongoose-paginate');

const userSchema = Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    lowercase: true,
    index: true
  },
  password: {
    type: String
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
},
{
  timestamps: true
});

userSchema.plugin(mongoosePaginate);

userSchema.methods.generateAuthToken = function (){
  const token = jwt.sign({
    _id: this.id,
    firstName: this.firstName,
    email: this.email,
  }, process.env.secret);
  return token;
}

module.exports = mongoose.model('User', userSchema);

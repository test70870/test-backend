const User = require('../models/User');
const constant = require('../constants/constant');
const mongoose = require('mongoose');

async function userAuth(req, res, next){
  try{
    let loggedInUser = req.user._id;
    let user = await User.findOne({ _id: mongoose.Types.ObjectId(loggedInUser), isDeleted: false });
    if(user){
      next();
    }
    else{
      constant.function.unauthorizedAccess(res);
    }
  } catch(err){
    constant.function.serverError(res, err);
  }
}

module.exports = userAuth;

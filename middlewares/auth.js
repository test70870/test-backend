const jwt = require('jsonwebtoken');
const constant = require('../constants/constant');

function auth(req, res, next){
  const token = req.header('x-auth-token');
  if(!token){
    console.log('Error no token');
    return res.status(constant.httpCode.success).json({
      success: false,
      code: constant.httpCode.networkConnectTimeout, // 599 code
      message: constant.message.accessDenied,
      data: []
    });
  }
  else{
    try{
      const decoded = jwt.verify(token, process.env.secret);
      req.user = decoded;
      console.log(req.user, '       decoded...........');
      next();
    } catch(err){
      console.log(err, 'Error session out');
      return res.status(constant.httpCode.success).json({
        success: false,
        code: constant.httpCode.networkConnectTimeout, // 599 code
        message: constant.message.sessionTimeout,
        data: []
      });
    }
  }
}

module.exports = auth;

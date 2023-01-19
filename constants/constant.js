const constant = {
  awsCredentials: {
    bucketName: "",
    region: "",
    accessKeyId: "",
    secretAccessKey: ""
  },
  httpCode: {
    processing: 102,
    success: 200, // Go to success
    created: 201, // Go to success
    accepted: 202, // Go to success
    nonAuthInfo: 203, // Go to success
    noContent: 204, // Give data null and go to success
    found: 302,
    badRequest: 400,
    unauthorized: 401,
    subscriptionRequired: 402,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    notAcceptable: 406,
    conflict: 409,
    noDataFound: 410,
    unProcessable: 422,
    internalServerError: 500,
    networkConnectTimeout: 599,
  },
  message: {
    success: 'Success',
    validationError: 'Validation error, try again',
    accessDenied: 'Access denied, no token found',
    accountCreated: 'Your account has been created successfully',
    emailAlreadyExist: 'This email is taken, try another',
    invalidInputs: 'Email/Password is incorrect',
    dataFound: 'Data found',
    dataNotFound: 'Data not found',
    dataUpdated: 'Data updated successfully',
    dataDeleted: 'Data deleted successfully',
    errorCreatingData: 'Error creating data',
    sessionTimeout: 'Session timeout',
  },
  function: {
    unauthorizedAccess: (res) => {
      return res.status(constant.httpCode.success).json({
        success: false,
        code: constant.httpCode.unauthorized,
        message: constant.message.unauthorized,
        data: []
      });
    },
    invalidCredentials: (res) => {
      return res.status(constant.httpCode.success).json({
        success: false,
        code: constant.httpCode.notFound,
        message: constant.message.invalidInputs,
        data: []
      });
    },
    dataFound: (res) => {
      return res.status(constant.httpCode.success).json({
        success: true,
        code: constant.httpCode.success,
        message: constant.message.dataFound,
        data: []
      });
    },
    dataNotFound: (res) => {
      return res.status(constant.httpCode.success).json({
        success: false,
        code: constant.httpCode.notFound,
        message: constant.message.dataNotFound,
        data: []
      });
    },
    serverError: (res, err) => {
      console.log(err,'   server error');
      return res.status(constant.httpCode.success).json({
        success: false,
        code: constant.httpCode.internalServerError,
        message: constant.message.serverError,
        data: err
      });
    },
  }
};

module.exports = constant;

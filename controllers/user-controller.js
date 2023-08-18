// const excel = require('node-excel-export');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('./client_secret.json');
const doc = new GoogleSpreadsheet('1adzRLUfPXYV5VFw_NShSX1Gg6o7yg6awwGThWjYF6IE');
const moment = require("moment");
const momentTimezone = require("moment-timezone");
const bcrypt = require('bcrypt');
const socket = require('../socket/socketEvents');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs-extra');
const uploadPath = path.join(__dirname, '../uploads/'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

// const uploadPath = ('./uploads')

const ffmpeg = require('ffmpeg');
const thumbsupply = require('thumbsupply');

const CommonController = require('./common-controller');
const User = require('../models/User');
const Message = require('../models/Message');
const constant = require('../constants/constant');
var exec = require('child_process').exec;
exports.test = async (req, res) => {
  try {
    // const inspDate = moment("2022-12-24T06:04:27.320+00:00");
    // const currentDate = moment();
    // const days = moment(currentDate).diff(inspDate, 'days');
    // console.log(days, '               days diff..........');

    // const currentTimeUtc = moment().utc();
    // const timeUtc180DaysBack = moment().utc().subtract(180, 'days');
    // console.log(currentTimeUtc, '        currentTimeUtc......');
    // console.log(timeUtc180DaysBack, '        timeUtc180DaysBack......');

    // var lastDate = new Date("2023-06-30T05:00:00.000+00:00");
    // var today = new Date();
    // var subscriptionDays = Date.daysBetween(today, lastDate);
    // console.log(subscriptionDays, '           subscriptionDays..............');

    // var lastDate = moment("2023-06-30T05:00:00.000+00:00").utc();
    // var today = moment().utc();
    // console.log(lastDate, '        lastDate...........');
    // console.log(today, '        today...........');
    // var subscriptionDays = moment(lastDate).diff(today, 'days');
    // console.log(subscriptionDays, '          subscriptionDays.........');

    // var inspDate = moment("2022-10-01T19:34:57.283+00:00") // Oct 1, 2022
		// var currentDate = moment() // Jan 30, 2023
		// var months = moment(currentDate).diff(inspDate, 'days'); // 120
    // console.log(months, '          months...............');


    // let inputArray = [];
    // for(let i=0;i<3;i++){
    //   inputArray.push({
    //     fromUser: "63c7a2715c4501dcc402ca7f",
    //     toUser: "63c7a2cf5c4501dcc402ca83",
    //     message: "hello: "+i
    //   });
    // }

    // Message.insertMany(inputArray).then(function (inptOk, inptErr) {
    //   if(inptErr){
    //     console.log(inptErr, '         inptErr........');
    //     return res.status(constant.httpCode.success).json({
    //       success: true,
    //       code: constant.httpCode.success,
    //       message: constant.message.success,
    //       data: inptErr
    //     });
    //   }
    //   else{
    //     console.log(inptOk, '         inptOk........');
    //     return res.status(constant.httpCode.success).json({
    //       success: true,
    //       code: constant.httpCode.success,
    //       message: constant.message.success,
    //       data: inptOk
    //     });
    //   }
    // });


    return res.status(200).json({
      success: true,
      code: 200,
      message: 'Success',
      data: {},
      timeZone: momentTimezone().tz(momentTimezone.tz.guess()).format('z')
    });
  } catch (err) {
    console.log(err, '      err...........')
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.fileUpload = async (req, res) => {
  try {

    req.pipe(req.busboy);

    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename.filename}' started`);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, Date.now()+filename.filename));
        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${filename.filename}' finished`);
            // res.redirect('back');
            return res.status(200).json({
              success: true,
              code: 200,
              message: 'Success',
              data: {}
            });
        });
    });

    // return res.status(200).json({
    //   success: true,
    //   code: 200,
    //   message: 'Success',
    //   data: req.body
    // });
  } catch (err) {
    console.log(err, '      err...........')
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.fileRead = async (req, res) => {
  try {

    const range = req.headers.range;
    if(!range){
      res.status(400).send("Requires Range header");
    }

    const videoPath = path.join(uploadPath)+'attitude-10mb.mp4';
    const videoSize = fs.statSync('./uploads/attitude-10mb.mp4').size;
    console.log(videoPath, '         videoPath.......');

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    console.log(contentLength, '         contentLength............');
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);

    // return res.status(200).json({
    //   success: true,
    //   code: 200,
    //   message: 'Success',
    //   data: {}
    // });
  } catch (err) {
    console.log(err, '      err...........')
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.ffMpegConversionMp3 = async (req, res) => {
  try {
    const process = new ffmpeg('./uploads/attitude-10mb.mp4');
    process.then((video) => {
      console.log("File conversion started.........");
      video.fnExtractSoundToMP3(`./uploads/${Date.now().toString()}_mp3_conversion.mp3`, (error, file) => {
        if (!error) {
          console.log('Audio file: ' + file);
          return res.status(200).json({
            success: true,
            code: 200,
            message: 'Success',
            data: file
          });
        } else {
          console.log('.............', error, '           error.............');
          return res.status(200).json({
            success: false,
            code: 201,
            message: 'Error converting video to mp3',
            data: error
          });
        }
      });

    }, (err) => {
      console.log('Error: ' + err);
      return res.status(200).json({
        success: false,
        code: 202,
        message: 'Error converting video',
        data: err
      });
    });

  } catch (err) {
    console.log(err, '      err...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.ffMpegConversionVideo = async (req, res) => {
  try {
    // const process = new ffmpeg('./uploads/big_buck.mp4')
    // process.then(function (video) {
    //   console.log('The video is ready to be processed')
    // }, (err) => {
    //   console.log('Error: ' + err)
    // });

    const file = req.files.file[0];
    console.log(file, "        file.............");

    const data = new Uint8Array(Buffer.from(file.buffer));
    fs.writeFile(`./uploads/${Date.now().toString()}_file.mp4`, data, (err, result)=>{
      if(err){
        console.log(err, "     err writing file.........");
      }
      else{
        console.log(result, "     result.........");
      }
    });

    return res.status(200).json({
      success: true,
      code: 200,
      message: 'Success',
      data: {}
    });

    // const process = new ffmpeg('./uploads/attitude-10mb.avi');
    // process.then((video) => {

    //   console.log("File conversion started.........");

    //   video.setVideoFormat('mp4').save(`./uploads/${Date.now().toString()}_mp4_conversion.mp4`, (error, file) => {
    //     if (!error) {
    //       console.log('Video file: ' + file);
    //       return res.status(200).json({
    //         success: true,
    //         code: 200,
    //         message: 'Success',
    //         data: file
    //       });
    //     }
    //     else {
    //       console.log('.............', error, '           error.............');
    //       return res.status(200).json({
    //         success: false,
    //         code: 201,
    //         message: 'Error converting video',
    //         data: error
    //       });
    //     }
    //   });

    // }, (err) => {
    //   console.log('Error: ' + err);
    //   return res.status(200).json({
    //     success: false,
    //     code: 202,
    //     message: 'Error converting video',
    //     data: err
    //   });
    // });

  } catch (err) {
    console.log(err, '      err...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.ffMpegGetFrame = async (req, res) => {
  try {
    // console.log(req?.files?.file[0], '           req?.files?.file[0]............');

    // const videoUrl = await CommonController.getSignedUrlS3("https://mediacardmetaverse.s3.us-east-2.amazonaws.com/nftAssetImages/1669090864212_primary_asset.mp4");
    // let process = new ffmpeg(`${videoUrl}`);

    let process = new ffmpeg('./uploads/attitude-10mb.mp4');
    process.then( (video) => {
      const file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + `-frame.jpg`;
      // video.addCommand('-ss', '00:00:24');
      video.fnExtractFrameToJPG('./uploads/', {
        start_time: 24,
        frame_rate: 1,
        number: 1,
        file_name: file_name,
      }, (error, files) => {
        if (!error){
          console.log('Frames: ' + files);
          return res.status(200).json({
            success: true,
            code: 200,
            message: 'Success',
            data: files,
          });
        }
        else{
          console.log(error, '         error in fnExtractFrameToJPG');
          return res.status(200).json({
            success: false,
            code: 200,
            message: 'Error in fnExtractFrameToJPG',
            data: err
          });
        }
      });
    }, (err) => {
      console.log('Error: ' + err);
      return res.status(200).json({
        success: false,
        code: 200,
        message: 'Error getting frame from video',
        data: err
      });
    });
  } catch (err) {
    console.log(err, '      err...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.ffMpegAddWatermark = async (req, res) => {
  try {
    // console.log(req?.files?.file[0], '           req?.files?.file[0] in ffMpegAddWatermark............');

    let process = new ffmpeg('./uploads/attitude-57mb.mp4');

    process.then( (video) => {
			// Callback mode
			video.fnAddWatermark(
        './uploads/samsung_watermark.png',
        `./uploads/${Date.now().toString()}_watermark_video.mp4`, {
				position: 'SW'
			}, (error, file) => {
				if(!error){
					console.log('New video file with watermark: ' + file);
          return res.status(200).json({
            success: true,
            code: 200,
            message: 'Success',
            data: file
          });
        }
        else{
          console.log('Error in fnAddWatermark: ' + error);
          return res.status(200).json({
            success: false,
            code: 500,
            message: 'Error',
            data: error
          });
        }
			});
		}, (err) => {
			console.log('Error in adding watermark: ' + err);
      return res.status(200).json({
        success: false,
        code: 500,
        message: 'Error',
        data: err
      });
		});

  } catch (err) {
    console.log(err, '      err in ffMpegAddWatermark...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.addWatermarkDynamic = async (req, res) => {
  try {
    const localMediaPath = await CommonController.downloadMediaFromS3();
    
    let process = new ffmpeg(localMediaPath);

    process.then( (video) => {
			// Callback mode
			video.fnAddWatermark(
        `./uploads/samsung_watermark.png`,
        `./uploads/${Date.now().toString()}_watermark_video.mp4`,
        { position : 'SW'	}, (error, file) => {
          if(!error){
            console.log('New video file with watermark: ' + file);
            return res.status(200).json({
              success: true,
              code: 200,
              message: 'Success',
              data: file
            });
          }
          else{
            console.log('Error in fnAddWatermark: ' + error);
            return res.status(200).json({
              success: false,
              code: 500,
              message: 'Error',
              data: error
            });
          }
			});
		}, (err) => {
			console.log('Error in adding watermark: ' + err);
      return res.status(200).json({
        success: false,
        code: 500,
        message: 'Error',
        data: err
      });
		});

    return res.status(200).json({
      success: true,
      code: 200,
      message: 'Success',
      data: {}
    });
  } catch (err) {
    console.log(err, '      err in addWatermarkDynamic...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.thumbSupply = async (req, res) => {
  try {
    // console.log(req?.files?.file[0], '           req?.files?.file[0]............');
    // const s3MediaUrl = "https://mediacardmetaverse.s3.us-east-2.amazonaws.com/nftAssetImages/1669090864212_primary_asset.mp4";
    const s3MediaUrl = "";
    const videoUrl = await CommonController.getSignedUrlS3(s3MediaUrl);
    // const videoUrl = "./uploads/attitude-10mb.mp4";
    console.log(videoUrl, '        videoUrl..................');
    thumbsupply.generateThumbnail(`${videoUrl}`, {
      size: thumbsupply.ThumbSize.LARGE, // or ThumbSize.LARGE
      timestamp: "15", // or `30` for 30 seconds
      forceCreate: true,
      cacheDir: "./thumbnails",
      mimetype: "video/mp4"
    }).then( (thumbnail) => {
      console.log(thumbnail, '         thumbnail...............');
      return res.status(200).json({
        success: true,
        code: 200,
        message: 'Success',
        data: thumbnail
      });
    } );

  } catch (err) {
    console.log(err, '      err...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.addDataToGoogleExcelSheet = async (req, res) => {
  try {
    // Create a document object using the ID of the spreadsheet - obtained from its URL.
    // const doc = new GoogleSpreadsheet('1adzRLUfPXYV5VFw_NShSX1Gg6o7yg6awwGThWjYF6IE');
    // Authenticate with the Google Spreadsheets API.

    await doc.useServiceAccountAuth(credentials);

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title, '   doc.title........');

    // const sheet = await doc.addSheet({ headerValues: ['name', 'email'] });
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.addRow({ Name: 'Larry Page', Email_Address: 'larry@google.com' });

    return res.status(200).json({
      success: true,
      code: 200,
      message: 'Success',
      data: {}
    });
  } catch (err) {
    console.log(err, '      err...........')
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

/** Chat application routes */

exports.signUp = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password
    } = req.body;
    console.log(req.body, '          req.body in signUp......');

    const findUser = await User.findOne({ email: email, isDeleted: false });
    if(findUser){
      return res.status(constant.httpCode.success).json({
        success: false,
        code: constant.httpCode.badRequest,
        message: constant.message.emailAlreadyExist,
        data: {}
      });
    }
    else{
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashed,
      });
      const createNewUser = await user.save();
      if(createNewUser){
        return res.status(constant.httpCode.success).json({
          success: true,
          code: constant.httpCode.success,
          message: constant.message.accountCreated,
          data: createNewUser
        });
      }
      else{
        return res.status(constant.httpCode.success).json({
          success: false,
          code: constant.httpCode.badRequest,
          message: constant.message.errorCreatingData,
          data: {}
        });
      }

    }
  } catch (err) {
    console.log(err, '      err in signUp...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.logIn = async (req, res) => {
  try {
    const {
      email, password
    } = req.body;

    const findUser = await User.findOne({ email: email, isDeleted: false });
    if(findUser){
      const comparePassword = await bcrypt.compare(password, findUser.password);
      // console.log(comparePassword, '        comparePassword..............');
      if(comparePassword){
        const token = findUser.generateAuthToken();
        return res.header('x-auth-token', token).json({
            success: true,
            code: constant.httpCode.success,
            message: constant.message.success,
            data: findUser,
            token: token
        });
      }
      else{
        return res.status(constant.httpCode.success).json({
          success: false,
          code: constant.httpCode.badRequest,
          message: constant.message.invalidInputs,
          data: {}
        });
      }
    }
    else{
      return res.status(constant.httpCode.success).json({
        success: false,
        code: constant.httpCode.badRequest,
        message: constant.message.dataNotFound,
        data: {}
      });
    }
  } catch (err) {
    console.log(err, '      err in logIn...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.getMyProfile = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
      let user = await User.findOne({ _id: mongoose.Types.ObjectId(loggedInUser), isDeleted: false });
      if(user){
        return res.status(constant.httpCode.success).json({
          success: true,
          code: constant.httpCode.success,
          message: constant.message.dataFound,
          data: user
        });
      }
      else{
        constant.function.dataNotFound(res);
      }
  } catch (err) {
    constant.function.serverError(res, err);
  }
}

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.body;

    const findUser = await User.findOne({ _id: mongoose.Types.ObjectId(id), isDeleted: false });
    // const findUser = await User.findOne({ _id: mongoose.Types.ObjectId(id), isDeleted: false }).populate({path: 'paymentMethods', options: { limit: 1, sort: { 'createdAt': -1 } } });

    if(findUser){
      return res.status(constant.httpCode.success).json({
        success: true,
        code: constant.httpCode.success,
        message: constant.message.success,
        data: findUser
      });
    }
    else{
      return res.status(constant.httpCode.success).json({
        success: false,
        code: constant.httpCode.badRequest,
        message: constant.message.dataNotFound,
        data: {}
      });
    }
  } catch (err) {
    console.log(err, '      err in signIn...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.postMessages = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const { toUser, message } = req.body;
    const newMessage = await new Message({
      fromUser: loggedInUser,
      toUser: toUser,
      message: message
    });
    const createMessage = await newMessage.save();
    io.emit('message', req.body);
    return res.status(constant.httpCode.success).json({
      success: true,
      code: constant.httpCode.success,
      message: constant.message.success,
      data: createMessage
    });
  } catch (err) {
    console.log(err, '      err in postMessages...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.getMessages = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const { id } = req.query;
    console.log(loggedInUser, '        loggedInUser.............');
    console.log(id, '        id.............');
    const options = {
      page: 1,
      limit: 50,
      sort: { createdAt: -1 },
    };
    // const getMessages = await Message.paginate({ fromUser: mongoose.Types.ObjectId(loggedInUser), toUser: mongoose.Types.ObjectId(id) }, options);

    const getMessages = await Message.paginate(
      // { fromUser: mongoose.Types.ObjectId(loggedInUser), toUser: mongoose.Types.ObjectId(id) },
      { $or:
        [
          { fromUser: mongoose.Types.ObjectId(loggedInUser), toUser: mongoose.Types.ObjectId(id) },
          { toUser: mongoose.Types.ObjectId(loggedInUser), fromUser: mongoose.Types.ObjectId(id) }
        ]
      },
      options);

    return res.status(constant.httpCode.success).json({
      success: true,
      code: constant.httpCode.success,
      message: constant.message.success,
      data: getMessages
    });
  } catch (err) {
    console.log(err, '      err in getMessages...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.listUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const options = {
      page: 1,
      limit: 50,
      sort: { createdAt: -1 },
      select: '_id firstName lastName email createdAt'
    };
    const users = await User.paginate({ _id: { $ne: mongoose.Types.ObjectId(loggedInUser) } }, options);
    return res.status(constant.httpCode.success).json({
      success: true,
      code: constant.httpCode.success,
      message: constant.message.success,
      data: users
    });
  } catch (err) {
    console.log(err, '      err in listUsers...........');
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

exports.createSocketRoom = async (req, res) => {
  try {
    console.log("createSocketRoom api hit.............");
    const io = socket.getIo();
    console.log(io, "        io.................");
    io.of("/").adapter.on("create_room_1", (room) => {
      console.log(`room ${room} was created`);
      return res.status(200).json({
        success: true,
        code: 200,
        message: 'Success',
        data: room
      });
    });
  } catch (err) {
    console.log(err, '      err...........')
    return res.status(200).json({
      success: false,
      code: 500,
      message: 'Internal server error',
      data: err
    });
  }
}

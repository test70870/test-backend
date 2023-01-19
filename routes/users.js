const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

const auth = require('../middlewares/auth');
const userAuth = require('../middlewares/userAuth');

const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = multer();

const uploadMedia = upload.fields([
  { name: 'file', maxCount: 1 },
]);

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/test', userController.test);

router.post('/file_upload',
  // upload.single('file'),
  userController.fileUpload
);

router.post('/file_read',
  userController.fileRead
);

router.get('/ffmpeg_conversion_mp3',
  userController.ffMpegConversionMp3
);

router.post('/ffmpeg_conversion_video',
  uploadMedia,
  userController.ffMpegConversionVideo
);

router.post('/ffmpeg_get_frame',
  uploadMedia,
  userController.ffMpegGetFrame
);

router.post('/ffmpeg_add_watermark',
  uploadMedia,
  userController.ffMpegAddWatermark
);

router.get('/add_watermark_dynamic',
  userController.addWatermarkDynamic
);

router.post('/thumbsupply',
  uploadMedia,
  userController.thumbSupply
);

router.get('/add_data_to_google_excel_sheet', userController.addDataToGoogleExcelSheet);

/** Chat application routes */

router.post('/signup', userController.signUp);

router.post('/login', userController.logIn);

router.get('/getMyProfile', auth, userController.getMyProfile);

router.get('/getUserById', auth, userController.getUserById);

router.post('/messages', auth, userAuth, userController.postMessages);

router.get('/messages', auth, userAuth, userController.getMessages);

router.get('/listUsers', auth, userAuth, userController.listUsers);

router.get('/createSocketRoom', userController.createSocketRoom);

module.exports = router;

import multer from 'multer';

const limits = {
  fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
  filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
  // fields: 10, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
  fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
  files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
};

const fileFilter = (req, file, callback) => {

  const typeArray = file.originalname.split('.');

  const fileType = typeArray.slice(-1)[0]; // 이미지 확장자 추출

  //이미지 확장자 구분 검사
  if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png') {
    callback(null, true);
  } else {
    return callback(
      { message: '*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다.' },
      false
    );
  }
};

var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'upload_imgs/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});

var upload = multer({
  dest: 'upload_imgs/',
  // limits: limits, // 이미지 업로드 제한 설정
  // fileFilter: fileFilter, // 이미지 업로드 필터링 설정
});
var uploadWithOriginalFilename = multer({ storage: storage });

module.exports = upload;

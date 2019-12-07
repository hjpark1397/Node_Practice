const express = require('express');
const multer = require('multer');//파일 업로드 모듈
const ejs = require('ejs');//템플릿 엔진
const path = require('path')//경로 설정

//Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){//cb : callback
        cb(null, file.fieldname + '-' + Date.now() +
         path.extname(file.originalname));//저장될 파일명 설정
    }
});

//init Upload
const upload = multer({
    storage: storage,//저장소
    limits:{filesize: 1000000},//파일 용량
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

//Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else{
        cb('Error: Images Only!');//오류 메시지 출력
    }
}

//init app
const app = express();

//ejs
app.set('view engine', 'ejs');//템플릿 엔진 : ejs로 설정

// static file (public)
app.use(express.static('./public'));//여기에 저장될 것임

app.get('/', (req, res) => res.render('index'));//이것을 만나면 인덱스로 넘어가는것

app.post('/upload', (req, res) => {
   // res.send('test') submit 버튼 작동 확인
   upload(req, res, (err) => {
       if(err){//error check
            res.render('index', {
                msg: err
            });
       } else {//에러 없을 경우
            // console.log(req.file)//파일을 출력해주고
            // res.send('test');//체크
            // 이제 업로드 한 파일을 보여주는 부분을 할 것이다!
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error: No File Selected!'
                });
            } else{
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                });
            }
       }
   });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
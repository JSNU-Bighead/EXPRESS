var express = require('express');
var app = express();
const fs = require('fs');
var multer = require('multer');

app.use(express.static('uploads'))
//只能以Form形式上传name为mFile的文件
//var upload = multer({ dest: 'upload/'}).single('mFile');
var upload = multer({ dest: 'upload/' }).any();
app.get('/', function (req, res) {
    console.log("--------访问根目录--------");
    res.send('hello, express');
    res.end();
});

app.get('/download', function (req, res) {
    console.log("---------访问下载路径-------------");
    var pathname = "/403.png";
    var realPath = "./uploads" + pathname;
    fs.exists(realPath, function (exists) {
        if (!exists) {
            console.log("文件不存在");
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.write("This request URL " + pathname + " was not found on this server.");
            res.end();
        } else {
            console.log("文件存在");
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    console.log("读取文件错误");
                    res.end(err);
                } else {
                    // res.writeHead(200, {
                    //     'Content-Type': 'text/html'
                    // });
                    console.log("读取文件完毕，正在发送......");
                    res.send(file);
                    res.end();
                    console.log("文件发送完毕");
                }
            });
        }
    });
});

app.post('/upload', function (req, res) {
    console.log("---------访问上传路径-------------");

    /** When using the "single" data come in "req.file" regardless of the attribute "name". **/
    upload(req, res, function (err) {
        //添加错误处理
        if (err) {
            console.log(err);
            return;
        }
        req.file = req.files[0];
        var tmp_path = req.file.path;
        console.log(tmp_path);

        /** The original name of the uploaded file
            stored in the variable "originalname". **/
        var target_path = 'uploads/' + req.file.originalname;

        /** A better way to copy the uploaded file. **/
        console.log(target_path);


        if (!fs.existsSync('uploads/')) {
            fs.mkdirSync('uploads/');
        }

        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function () {
            res.end();
        });
        src.on('error', function (err) {
            res.end();
            console.log(err);
        });

    });



});

var port = 3000;
var hostname = '10.101.34.37';
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

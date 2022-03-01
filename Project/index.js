//imports
const express = require('express')
const app = express()
const port = 8888
//database
const bodyParser = require('body-parser')
const mysql = require('mysql')
//for image uploading
const multer = require('multer')
const path = require('path')


//Statov Files
app.use(express.static('public'))
app.use('/css',express.static(__dirname+'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/music', express.static(__dirname + 'public/music'))
app.use('/slick', express.static(__dirname + 'public/slick'))
app.use('/webfont', express.static(__dirname + 'public/webfont'))
//database
app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

//MySQL
const pool = mysql.createPool({
    connectionLimit     : 10,
    host                : 'localhost',
    user                : 'root',        // 连接数据库服务器需要的用户名
    password            : '1043416763',        // 连接数据库服务器需要的密码
    database            : 'itisadatabase'      //你要连接的数据库的名字
});

//Get all Likes
app.get('/:all',(req,res)=>{
    
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from likes', (err, rows) => {
            connection.release()

            if (!err){
                res.send(rows)
            }else{
                console.log(err)
            }
        })

    })
})

//Get a single Like by id
app.get('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from likes where id = ?',[req.params.id], (err, rows) => {
            connection.release()

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })

    })
})

//Delete a Likes by id
app.delete('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body

        connection.query('delete from likes where id  = ?', [req.params.id], (err, rows) => {
            connection.release()

            if (!err) {
                res.send(`Likes with the record ID: ${[req.params.id]} has been added.`)
            } else {
                console.log(err)
            }
        })

        console.log(req.body)
    })
})

//add a Likes 
app.post('/:insert', (req, res) => {
    if (req.param('cond') === 'AddLikes') {
        pool.getConnection((err, connection) => {
            if (err) throw err
            console.log(`connected as id ${connection.threadId}`)

            const params = req.body

            connection.query('insert into likes set ?', params, (err, rows) => {
                connection.release()

                if (!err) {
                    res.send(`Likes with the name: ${[params.name]} has been added.`)
                } else {
                    console.log(err)
                }
            })

            console.log(req.body)
        })
    }
    //Add a person's profile
    else if(req.param('cond') === 'addPerson') {
        pool.getConnection((err, connection) => {
            if (err) throw err
            console.log(`connected as id ${connection.threadId}`)

            const params = req.body

            connection.query('insert into Person set ?', params, (err, rows) => {
                connection.release()

                if (!err) {
                    res.send(`Person has been added.`)
                } else {
                    console.log(err)
                }
            })

            console.log(req.body)
        })
    }
    else{   //Profile Image Uploading

    }
})
//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/img/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
});
app.post("/", upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        var imgsrc = 'img/' + req.file.filename
        var insertData = "INSERT INTO Person(Image)VALUES(?)"
        pool.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
        })
    }
});
//update a Likes 
app.put('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const{id,liked_account,like_account} = req.body

        connection.query('update likes set liked_account = ? where like_account = ?', [liked_account, like_account], (err, rows) => {
            connection.release()

            if (!err) {
                res.send(`Likes with the name:${id} has been updated.`)
            } else {
                console.log(err)
            }
        })

        console.log(req.body)
    })
})

//Set Views
app.set('views','./views')
app.set('view engine','ejs')
app.get('',(req,res)=>{
    res.render('index2',{text:'This is EJS'})
})

app.get('/about', (req, res) => {
    res.render('about', { text: 'About Page' })
})



//listen on port 8888
app.listen(port,()=>console.info("Listening on port"+port))
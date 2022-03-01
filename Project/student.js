const express = require('express')

const app = express()

app.use(express.urlencoded())

const connection = require('./utils/sql')
app.post('/api/student',(req,res)=>{
    console.log(req.body)

    // 2. 添加到数据库中
    const sql = `select * from Likes`
    console.log('要执行的sql', sql)
    // connection.query(sql语句,(err, data)=>{
    connection.query(sql,(err, data)=>{
        if(err) {
            console.log(err)
            res.json({msg:'添加失败', code: 0})
        } else {
            console.log(data)
            // 返回
            res.json({msg:'添加成功', code: 1})
        }
    })
})

app.get('/api/student',(req,res)=>{
    // 返回
    res.json({msg:'查询成功', code: 1})
})

app.listen(3000, ()=>{
    console.log('接口服务器启动,3000...')
})
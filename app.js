import express from 'express'
const app = express()
const port = 3000;

app.get("/",(req,res) =>{
    res.status(200).send("hello from server!!")
})

app.listen(port , (req,res) =>{
    console.info("Server start at port",port);
}) 
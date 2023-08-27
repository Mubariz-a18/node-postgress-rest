
const express = require('express')
const StudentRoutes = require('./src/student/routes')
const dotenv = require("dotenv")

dotenv.config()

const app = express()
app.use(express.json())

app.use("/api/students",StudentRoutes)

app.get('/',(req,res)=>{
  res.send("hello world")
})

app.listen(3000,()=>{
  console.log("server started on port 3000");
})
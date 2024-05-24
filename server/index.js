import express from 'express'
import colors from 'colors'
import cors from 'cors'
import authRoute from './routes/auth.js'
import loginRoute from './routes/auth.js'
import postsRoute from './routes/posts.js'
import cookieParser from 'cookie-parser'
import multer from 'multer'
const app = express()

.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',  //Cookies set krne k liye fronttend per ye do cheezen dena laazmi hai  wrna cookie set ni hogi or frontend per jdr api call kr rhe ho udr withCredentials: true ; likhna laazmi hai wrna cookie set ni hogi
    credentials: true
}))


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null ,'../client/public/upload')
  }, 
  filename: (req, file, cb) => {
   
    cb(null, Date.now()+file.originalname)
  }
})
const upload = multer({storage})
app.post('/api/upload', upload.single('file'), (req,res) => {
    const file = req.file
res.status(200).json(file.filename)
})

app.use('/api/auth/', authRoute)
app.use('/api/users/', loginRoute)
app.use('/api/posts/', postsRoute)

app.listen(8000, (req, res) => {
    console.log("server started successfully".bgCyan)
})
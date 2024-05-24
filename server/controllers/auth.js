import db from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
export const register = async (req, res) => {
    try {
      
        const q = 'SELECT * FROM users WHERE email = ? OR username = ?'
        const values = [req.body.email, req.body.username]
        const [users] = await db.query(q, values)
        if (users.length) return res.status(409).json("user already exists")
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        const query = 'INSERT INTO users(username, email, password) VALUES(?,?,?)'
        const value = [req.body.username, req.body.email, hash]
        await db.query(query, value)
        res.status(200).json("user created successfully")
    } catch (error) {
        console.log(error)
    }
}
////////////////////////////////////////////////////////////////////////////////////

export const login = async (req, res) => {

    try {
        // check user
        const checkUserExists = 'SELECT * FROM users WHERE username = ?'
        const value = [req.body.username]
        const [users] = await db.query(checkUserExists, value)
        if (users.length === 0) return res.status(404).json("User not found")
        // check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, users[0].password)
        if (!isPasswordCorrect) return res.status(400).json('wrong username or password')
            // Generate token
        const token = jwt.sign({ id: users[0].id }, process.env.Jwt_Secret)
        const { password, ...other } = users[0]
        // Set token
        res.cookie('access_token', token, {httpOnly: true, sameSite: 'none', secure: true}).status(200).json(other)
    } catch (error) {
        console.log(error)
    }
}
////////////////////////////////////////////////////////////////////////////////////
export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true
  }).status(200).json("User has been logged out")
}
import db from '../config/db.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
export const getPosts = async (req, res) => {
    // const q = req.query.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts"

    // db.query(q, [req.query.cat],(err, data) => {
    //     if(err) return res.status(err)
    //     return res.status(200).json(data)
    // })

    try {
        const q = req.query.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts"

        const values = [req.query.cat]
        const [posts] = await db.query(q, values)
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
    }
}
export const getPost = async (req, res) => {
    try {

        const q = 'SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?'
        const values = [req.params.id]
        const [data] = await db.query(q, values)
        res.status(200).json(data[0])
    } catch (error) {
        console.log(error)
    }
}


export const addPost = async (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("not authenthicated")
    jwt.verify(token, process.env.Jwt_Secret, async (err, userinfo) => {
        try {
            if (err) return res.status(403).json("Token is not valid")
            const q = "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?,?,?,?,?,?)";
            const values = [
                req.body.title,
                req.body.desc,
                req.body.img,
                req.body.cat,
                req.body.date,
                userinfo.id
            ]

            const [data] = await db.query(q, values)
            if (!data) return res.status(500).json("internal server error")

            res.status(200).json("post created successfully")
        } catch (error) {
            console.log(error)
        }
    })
}


export const deletePost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("not authenthicated")

    jwt.verify(token, process.env.Jwt_Secret, async (err, userInfo) => {
        try {
            if (err) return res.status(403).json("Token is not valid!")

            const postId = req.params.id
            const q = 'DELETE FROM posts WHERE `id` =? AND `uid` = ?'
            const values = [postId, userInfo.id]
            const [data] = await db.query(q, values)
            if (!data) return res.status(403).json('You can delete only your posts')
            res.status(200).json("post deleted successfully")
        } catch (error) {
            console.log(error)
        }


    })
}


// export const updatePost = (req, res) => {
//     const token = req.cookies.access_token
//     if (!token) return res.status(401).json("not authenthicated")
//     jwt.verify(token, 'jwtkey', async (err, userinfo) => {
//         try {
//             if (err) return res.status(403).json("Token is not valid")

//             const postId = req.params.id
//             const q = 'UPDATE posts SET `title=?`, `desc=?`, `img=?`, `cat=?` WHERE `id =?` AND `uid =?`'
//             const values = [
//                 req.body.title,
//                 req.body.desc,
//                 req.body.img,
//                 req.body.cat,
//             ]

//             const [data] = await db.query(q, [...values, postId, userinfo.id])
//             if (!data) return res.status(500).json("internal server error")

//             res.status(200).json("post updated successfully")
//         } catch (error) {
//             console.log(error)
//         }
//     })
// }


export const updatePost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("not authenticated")
    jwt.verify(token, process.env.Jwt_Secret, async (err, userinfo) => {
        try {
            if (err) return res.status(403).json("Token is not valid")

            const postId = req.params.id
            const q = 'UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `id`=? AND `uid`=?'
            const values = [
                req.body.title,
                req.body.desc,
                req.body.img,
                req.body.cat,
                postId,
                userinfo.id
            ]

            const [data] = await db.query(q, values)
            if (!data) return res.status(500).json("internal server error")

            res.status(200).json("post updated successfully")
        } catch (error) {
            console.log(error)
        }
    })
}

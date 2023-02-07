const express = require('express')
const app = express()
const cors = require('cors')
const { postUsuarios, verificarCredenciales,getPerfil } = require('./consultas')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


app.listen(3000, console.log("SERVER ON"))
app.use(cors())
app.use(express.json())

// Middleware

const validarCredenciales = (req, res, next) => {
    try {
        jwt.verify(req.header('Authorization'), JWT_SECRET)
        next()
    }
    catch (error) {
        res.status(401).send('No autorizado')
    }}  

    
    const JWT_SECRET = process.env.JWT_SECRET || '123456789'

app.post('/login', async (req, res) => {
   try{
    const { email, password } = req.body
    await verificarCredenciales(email, password)
    const token = jwt.sign({email}, JWT_SECRET)
    res.send(token)
   }
    catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error)
    }
})


app.post ('/usuarios', async (req, res) => {
    try {
        const passwordcifrada = await bcrypt.hash(req.body.password, 10)
        const { email, rol, lenguage } = req.body
        const rowCount = await postUsuarios(email, passwordcifrada, rol, lenguage)
        res.send(rowCount)
    }
    catch (error) {
        console.log(error);
    }
})


app.get('/usuarios',validarCredenciales,  async (req, res) => {
    try{
        const { id } = req.params
        const Authorization = req.header('Authorization')
        const token = Authorization.replace('Bearer')[1]
        console.log (token)
        jwt.verify(token, JWT_SECRET)   
        const { email } = jwt.decode(token)
        console.log (" email: ", email)
        await getPerfil(id)
        res.send (email)
    }
    catch (error) {
        res.status(error.code || 500).send(error)
    }
})

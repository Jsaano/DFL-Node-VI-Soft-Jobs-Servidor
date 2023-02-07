const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'softjobs',
    allowExitOnIdle: true
})


const postUsuarios = async (req, res) => {
try {
    const { email, password, rol , lenguage } = req.body
    const consulta = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)"
    const values = [email, password, rol, lenguage]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount) throw { status: 404, message: 'No se pudo crear el usuario' }
    return rowCount
} catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error)
}
}


const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const {rowCount} = await pool.query (consulta, values)
    if (!rowCount) throw {status: 404, message: 'Credenciales incorrectas'}
}

const getPerfil = async () => {
    const { email,id } = req.body
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND id = $2"
    const values = [email, id]
    const {rowCount} = await pool.query (consulta, values)
    if (!rowCount) throw {status: 404, message: 'No se pudo encontrar el perfil'}
}

    

module.exports = { postUsuarios, verificarCredenciales, getPerfil }

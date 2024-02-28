//### CONTROLLER AUTH ###

//SCHEMAS DATABASE
const MetadataSchema = require('../db/models/metadata.schema') 
const SerieSchema = require('../db/models/serie.schema')
const FilmSchema = require('../db/models/film.schema')
const UserSchema = require('../db/models/user.schema')


require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//--------------------------------------------------------------------


exports.register = async (req, res) =>{
    const {name, email, password} = req.body


    // criar senha hash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        name: name,
        email: email,
        password: passwordHash
    })

    newUser.save()
    .then((doc)=>{
        
        // criar e assinar token
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: newUser._id }, secret);

        return res.status(200).json({msg: 'Usuario registrado com sucesso!: ' + doc, token})
    })
    .catch((err)=>{
       return res.status(400).json({msg: 'Erro ao registar usuario: ' + err})
    })
}


exports.login = async (req, res) => {
    const {email} = req.body
	const UserLogin = await User.findOne({email: email})

    //gerar token
    const secret = process.env.SECRET
    const token = jwt.sign(
        {
            id: UserLogin._id
        }, secret
    )


    return res.status(200).json({msg: 'Autenticação realizada com sucesso!', token})
}

exports.loginFront = async (req, res) => {
    return res.render('login')
}
exports.registerFront = async (req, res) => {
    return res.render('register')
}




require('dotenv').config()
const User = require('../db/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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

        res.status(200).json({msg: 'Usuario registrado com sucesso!: ' + doc, token})
    })
    .catch((err)=>{
        res.status(200).json({msg: 'Erro ao registar usuario: ' + err})
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


    res.status(200).json({msg: 'Autenticação realizada com sucesso!', token})
}

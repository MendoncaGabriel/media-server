const User = require('../db/models/user')
const express =  require('express')
const routes = express.Router()
require('dotenv').config()
const authController = require('../controller/authController')
const bcrypt = require('bcrypt')


async function validationRegister(req, res, next){
    function checkEmail(email){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function checkPass(password){
        if(password.length < 4 ){
            return  'small'
        }else if(password.length > 15){
            return 'large'
        }
    }

    const {name, email, password} = req.body
    if(!name){
       return res.status(400).json({msg: 'Nome e obrigatorio!'}) 
    }  
    if(!email){ 
        return res.status(400).json({msg: 'Email e obrigatorio!'}) 
    }
    if(!password){ 
        return res.status(400).json({msg: 'Senha e obrigatorio!'})
    }

    
    const testEmail = checkEmail(email)
    if(testEmail == false){
        res.status(400).json({msg: 'Email não e valido'})
    }

    const testPass = checkPass(password)
    testPass == 'small' ? res.status(400).json({msg: 'Senha e muito pequina!'}) :  testPass == 'large' ? res.status(400).json({msg: 'Senha e muito grande!'}) : null
    

    // verificar se o usuário já existe
    const userExists = await User.findOne({ email: email });
    if (userExists) {
        return res.status(422).json({ msg: "por favor, utilize outro email" });
    }

    next()
}

async function checkLogin(req, res, next){
    const {email, password} = req.body

    if(!email){
		return res.status(400).json({msg: 'O email obrigatorio!'})
	}	
	if(!password){
		return res.status(400).json({msg: 'A senha obrigatorio!'})
	}	

    //checar se usuario existe
	const UserLogin = await User.findOne({email: email})
	if(!UserLogin){
		return res.status(404).json({msg: 'usuario não encontrado!'})
	}

    //verificar senha confere com cadastro
    const checkPassword = await bcrypt.compare(password, UserLogin.password)
    if(!checkPassword ){
        return res.status(422).json({msg: 'Senha invalida'})
    }


    
    next()
}

routes.get('/register', authController.registerFront)
routes.get('/login', authController.loginFront)


routes.post('/register', validationRegister, authController.register)
routes.post('/login', checkLogin, authController.login)

module.exports = routes
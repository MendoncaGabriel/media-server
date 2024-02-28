//### ROTA AUTH ###    
require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

//CONTROLLERS
const authController = require('../controller/auth.controller')
const filmController = require('../controller/film.controller')
const metadataController = require('../controller/metadata.controller')
const pageController = require('../controller/page.controller')
const scannerController = require('../controller/scanner.controller')
const seriesController = require('../controller/series.controller')

//MIDDLEWARE
const uploadImage = require('../middleware/uploadImage.middleware');
const uploadVideo = require('../middleware/uploadVideo.middleware')
const checkToken = require('../middleware/checkToken.middleware')


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

//Front End - ADMIN
router.get('/register', authController.registerFront)
router.get('/login', authController.loginFront)


//Back End - USER
router.post('/register', validationRegister, authController.register)
router.post('/login', checkLogin, authController.login)

module.exports = router
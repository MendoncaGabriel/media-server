const jwt = require("jsonwebtoken");
const User = require('../db/models/user')

async function checkToken(req, res, next) {
    const token = req.cookies.token

  if (!token) {
    //return res.status(401).json({ msg: "Acesso negado!" });
    return res.render('login' )
  }


  try {
    const secret = process.env.SECRET;
    const userId = await jwt.verify(token, secret).id

    const user = await User.findById(userId)


    if(userId && user.able == true){
      next();
    }else{
      //return res.status(401).json({ msg: "Acesso negado!" });
      return res.render('login' )
    }

  } catch (erro) {
    return res.render('login' )
    //res.status(400).json({ msg: "Token Invalido!" });
  }
}

module.exports = checkToken
const express = require('express');
const app = new express();
const port = 3000;
const dir = process.cwd();
const path = require('path')
const fs = require('fs')
const captcha = require('./utils/code')
const userInfoFile = path.join(dir, '/DB/user.json')
const bodyParser = require('body-parser')
const Base64 = require('js-base64')
const cors = require('cors')
import { createToken, verifyToken } from './utils/token';
let codeText;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("*", (req, res, next) => {
  res.header("Access-control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-control-Allow-Method", 'GET,PUT,POST,DELETE');
  next();
})
app.use(async (req, res, next) => {
  let url = req.url
  if (url.indexOf('/login') === -1 || url.indexOf('/code') === -1) {
    let headers = req.headers;
    if (headers.token) {
      let codeToken = verifyToken(headers.token)
      req.state = codeToken.uuid
      await next()
    } else {
      await next()
    }
  } else {
    await next()
  }
})


app.get('/getimage', (req, res) => {
  res.status(200).send('https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture&quot')
  // if (req.state) {
  // } else {
  //   res.saatus(200).json({ code: 3002, message: '无token信息' })
  // }
})
app.get('/code', (req, res) => {
  let code = captcha()
  codeText = code.text
  res.type("svg")
  res.status(200).send(code.data)
  res.end()
})

app.post('/login', (req, res) => {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(userInfoFile, { flag: "a+" }, (error, data) => {
      try {
        resolve(data.toString())
      } catch (err) {
        reject(err)
      }
    })
  })
  promise.then((info) => {
    let user = JSON.parse(info.toString())
    // let params = JSON.parse(Base64.decode(...Object.keys(req.body)));
    let params = JSON.parse(JSON.stringify(req.body))
    try {
      if (codeText.toUpperCase() !== params.code.toUpperCase()) {
        res.status(200).send({ code: 3001, message: '验证码错误' })
        return
      }
      if (params.username === user.user && params.password === user.password) {
        let token = createToken(user)
        res.status(200).send({ code: 200, message: '登录成功', token: token })
      } else {
        res.status(200).send({ code: 3000, message: '密码错误' })
      }
    } catch (err) {
      res.status(200).send({ code: 3000, message: '接口错误' })
    }
  })
})

app.listen(port, () => {
  console.log(`服务开启成功, 端口号为${port}`)
})
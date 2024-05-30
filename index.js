const { createServer } = require('http');
const { Gtc } = require('gtc-js')
const qrcode = require('qrcode-terminal')
const express = require('express');
const path = require('path'); 
const app = express();
let anu;

app.get("/", (req, res) => {
  res.send("denis kontol")
})
app.get("/gtc", async(req, res) => {
  let { nomer } = req.query
  main(nomer).then(() => {
    res.send(anu)
  })
})

const main = async (nomer) => {
  const gtc = new Gtc({
    cookiePath: './cookie.json',
    showQr: false,
    puppeteer: {
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreDefaultArgs: ['--disable-extensions'],
    },
  })

  gtc.on('qrcode', (value) => {
    qrcode.generate(value, { small: true })
  })

  gtc.on('logged', (logged) => {
    if (logged) {
      console.log('logged')
    } else {
      console.log('scan qr code first')
    }
  })

  gtc.on('error', (error) => {
    console.error(error)
  })

  await gtc.init()

  anu = await gtc.find('ID', nomer) // just random phone number
  
}

const server = createServer(app);

module.exports = server

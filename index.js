const { createServer } = require('http');
const PN = require("awesome-phonenumber")
const express = require('express');
const path = require('path'); 
const app = express();
const truecallerjs = require("truecallerjs");
const axios = require('axios');

app.get("/", (req, res) => {
  res.send("GET /lookup?no=")
})
app.get("/lookup", async(req, res) => {
  let { no } = req.query
  let truecaller = await tcl(no)
  let eyecon = await eyecon(no)
  res.json({ truecaller, eyecon })
})

const tcl = async (no) => {
    const searchData = {
        number: no,
        countryCode: await (await getCountry(no)).region,
        installationId: "a2i0Z--nBHL5ckIkLhqh1dIziCjrZApo0sZyWzPHJQkz12jc6VSV7Y4r27Hufp6l",
    };

    return await truecallerjs.search(searchData)
        .then(async response => {
            return response.json()
        });
};

const getCountry = async(no) => {
let { regionCode, countryCode } = await (await PN("+"+no)).g
return { region: regionCode, country: countryCode }
}
const eyecon = async (no) => {
    const { country } = await getCountry(no)
    const config = {
        method: 'get',
        url: `https://eyecon.p.rapidapi.com/api/v1/search?code=${country}&number=${no.substring(2)}`,
        headers: {
            'x-rapidapi-host': 'eyecon.p.rapidapi.com',
            'x-rapidapi-key': '8fbd6b3e85msh018cc5b36b3ec24p1da66fjsn3a5a1073ba31'
        }
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error('Eyecon API error:', error);
        throw error;
    }
};

const server = createServer(app);

module.exports = server

const { createServer } = require('http');
const express = require('express');
const path = require('path'); 
const app = express();




const server = createServer(app);

module.exports = server

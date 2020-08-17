const express = require('express')
const path = require('path')
const app = express();
app.use(express.static(__dirname + '/dist/covidtracker'))
app.get('/*' , (req , res )=>{
    res.sendFile(path.join(__dirname + '/dist/covidtracker/index.html'));
});
app.listen(8000)

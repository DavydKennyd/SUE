const express = require('express');



const app = express();
const path = require('path');
const router = express.Router();
app.use(express.static('src'))


router.get('/',function(req,res){
    res.sendFile(__dirname + "/src/index.html");
});


console.log("O servidor está rodando");

app.use('/',router);
app.listen(process.env.port || 3000);
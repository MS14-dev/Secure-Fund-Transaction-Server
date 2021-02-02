 var express = require('express');
 var indexRouter = express.Router();

 var bodyParser=require('body-parser');

 indexRouter.use(bodyParser.json());

indexRouter.route('/')
.get((req,res)=>{

    res.render('index');

})

module.exports = indexRouter;


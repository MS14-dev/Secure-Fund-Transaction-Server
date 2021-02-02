const exoress=require('express');
const bodyParser=require('body-parser');
const crypto=require('crypto-js');
const DES=require('../3des');
const key=require('../key')

const connection=require('../database');

var adminRouter=exoress.Router();
adminRouter.use(bodyParser.json());

adminRouter.route('/log')
.get((req,res)=>{
    var userName=req.body.userName;
    var password=crypto.SHA256(req.body.password).toString();
    connection.query(`SELECT * FROM admin WHERE userName='${userName}' && password='${password}'`,(err,row)=>{
        if(err) throw err;
        else{
        res.statusCode=200;

        connection.query(`select*from users`,(err,row)=>{
            if(err) throw err;
            if(row.length!=0){
                for(var i=0;i<row.length;i++){
                    row[i].name=DES.decrypt(row[i].name,key);
                    row[i].accountNumb=DES.decrypt(row[i].accountNumb,key);
                    row[i].amount=parseInt(DES.decrypt(row[i].amount,key),10);

                }
                res.render('admin',{users:row})
            }
            else{
                res.render('admin');
            }
        })
    }
        
    })
})

module.exports=adminRouter;
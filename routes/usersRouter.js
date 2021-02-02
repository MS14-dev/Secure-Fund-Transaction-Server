var express = require('express');
var Crypto=require('crypto-js')
var AES=require('../AES');
var TriDES=require('../3DES')
var {key,salt}=require('../key');

var userRouter = express.Router();
var bodyParser=require('body-parser');
var connection=require('../database');

userRouter.use(bodyParser.json());

//log in a user
 userRouter.route('/log')
 .post((req,res)=>{
        
     var userName=req.body.userName
     var password=req.body.password;
     var pin=req.body.pin;
     var password_encrypted=Crypto.SHA256(password).toString();
     var pin_encrypted=Crypto.SHA256(pin).toString();


     
     connection.query(`select * from users where userName='${userName}'`,(err,rowU)=>{
         if(err) throw err;
         if(rowU.length!=0){
             
             if(password_encrypted==rowU[0].password){
                 if(pin_encrypted==rowU[0].pin){
 
                   var accountNumb_User=AES.decrypt(rowU[0].accountNumb,password,pin);
                   var name=AES.decrypt(rowU[0].name,password,pin);
                   var bankName=AES.decrypt(rowU[0].bankName,password,pin);
                   var branchName=AES.decrypt(rowU[0].branchName,password,pin);
                   var accountNumb_Amount=AES.encrypt(accountNumb_User,key,salt);
                   
                   connection.query(`select * from amountTable where accountNumb="${accountNumb_Amount}"`,(err,rowA)=>{
                     if(err) throw err;
                     if(rowA.length!=0){
                         
                         //var amount=des.decrypt(rowA[0].amount,system.key);
                         res.json({
                            accountNumb_User,
                            name,
                            bankName,
                            branchName,
                            //amount:des.decrypt(rowA[0].amount,key),
                            amount:TriDES.decrypt(rowA[0].amount,key,salt),
                            pin,
                            userName,
                            password
                        })
                     }
                 })
                 }
                 else{
                 res.send('Incorrect Password or PIN');
                 }
             }
             else{
                res.send('Incorrect Password or PIN');
             }
            
         }
         else{
          res.send("Sorry No Any User");
         }
     })
})

 //send the login form to the user
 userRouter.route('/signin')
 .get((req,res)=>{
     res.render('signin');
 })

 //register a new user in the system
 userRouter.route('/signin')
 .post((req,res)=>{

    var pin=req.body.pin;
    var userName=req.body.userName;
    var password=req.body.password
    var accountNum=req.body.accountNumb
    var name=req.body.name
    var bankName=req.body.bankName;
    var branchName=req.body.branchName;
    //console.log(req.body)
    
    if(name=='' || pin=='' || password=='' || userName==''  || accountNum=='' || bankName=='' || branchName==''){
        res.send('Every Feild must filled')
      }
    else{
    
    var amount=TriDES.encrypt('10000',key,salt)
    //var amount=des.encrypt('10000',key)
    var accountNumb_User=AES.encrypt(accountNum,password,pin); 
    var accountNumb_Amount=AES.encrypt(accountNum,key,salt); 
    
    var bankName_encrypted=AES.encrypt(bankName,password,pin); 
    var branchName_encrypted=AES.encrypt(branchName,password,pin);
    var pin_encrypted=Crypto.SHA256(pin).toString(); 

    var password_encrypted=Crypto.SHA256(password).toString();
    var name_encrypted=AES.encrypt(name,password,pin);
//
    if(pin.length==3){
    
        connection.query(`select*from users where userName='${userName}'`,(err,row)=>{
            if(err){
                throw err;
            }
            if(row.length==0){
                connection.query(`select*from amountTable where accountNumb='${accountNumb_Amount}'`,(err,row)=>{
                    if(err) throw err;
                    if(row.length!=0){
                        res.send({message:'The Account Number is already Registered'})
                    }
                    else{
                        connection.query(`insert into users values('${userName}','${password_encrypted}','${accountNumb_User}','${name_encrypted}','${bankName_encrypted}','${branchName_encrypted}','${pin_encrypted}')`,(err)=>{
                            if(err) throw err
                            else{
                                connection.query(`insert into amountTable values('${accountNumb_Amount}','${amount}')`,(err)=>{
                                    if(err) throw err;
                                    else{//new table creating part start from here
                                         connection.query(`create table Account_${accountNum} (id mediumint not null AUTO_INCREMENT primary key,amount varchar(200) not null,rec varchar(200) not null,send varchar(200) not null,date varchar(200) not null);`,(err)=>{
                                               if(err) throw err;
                                               else{
                                               //res.send('Successfully created')
                                               res.send({
                                                   name,
                                                   bankName,
                                                   branchName,
                                                   amount:'10000',
                                                   accountNumb:accountNum,
                                                   pin,
                                                   userName,
                                                   password
                                               })
                                               
                                               }
                                             })
                                        
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else{
                res.send({message:'User Name already reserved'})
            }
        })
    
        
    
    }else{
        res.send({message:'Invalid Pin'})
    }
    }
})

// userRouter.route('/history')
// .get((re,res)={
    
// })



module.exports=userRouter;
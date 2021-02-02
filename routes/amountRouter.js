var express = require('express');
var bodyParser=require('body-parser');
var Crypto=require('crypto-js')
var connection=require('../database');
var AES=require('../AES');
var TriDES=require('../3DES')
var {key,salt}=require('../key');
const { TripleDES } = require('crypto-js');



var amountRouter = express.Router();


amountRouter.use(bodyParser.json());

amountRouter.route('/transfer')
.post((req,res)=>{
    var rec_accountNumb=req.body.rec_accountNumb;
    var accountNumb=req.body.accountNumb;
    var fund_amount=parseInt(req.body.fund_amount);

    var rec_accountNumb_encrypted=AES.encrypt(rec_accountNumb,key,salt);
    var accountNumb_encrypted=AES.encrypt(accountNumb,key,salt);
    //res.end(typeof(fund_amount))

    connection.query(`select * from amountTable where accountNumb='${rec_accountNumb_encrypted}'`,(err,recRow)=>{
        if(err) throw err;
        if(recRow.length!=0){
            
            connection.query(`select*from amountTable where accountNumb='${accountNumb_encrypted}'`,(err,sendRow)=>{
                if(err) throw err;
                
                if(sendRow.length!=0){

                    
                    var deRecAmount=parseInt(TriDES.decrypt(recRow[0].amount,key,salt));
                    //var deRecAmount=parseInt(des.decrypt(recRow[0].amount,key));
                    var deSendAmount=parseInt(TriDES.decrypt(sendRow[0].amount,key,salt));
                    //var deSendAmount=parseInt(des.decrypt(sendRow[0].amount,key));

                    if(deSendAmount>fund_amount && deSendAmount>=500){
                       var senderAmount=deSendAmount - fund_amount;
                       var recAmount=  deRecAmount + fund_amount;
 
                       
                       var senderNewAmount=TriDES.encrypt(senderAmount.toString(),key,salt);
                       //var senderNewAmount=des.encrypt(senderAmount.toString(),key);
                    
                       var recNewAmount=TriDES.encrypt(recAmount.toString(),key,salt);
                       //var recNewAmount=des.encrypt(recAmount.toString(),key);
                    
                        connection.query(`update amountTable set amount='${senderNewAmount}' where accountNumb='${accountNumb_encrypted}'`,(err)=>{
                          if(err) throw err;
                          else{
                              connection.query(`update amountTable set amount='${recNewAmount}' where accountNumb='${rec_accountNumb_encrypted}'`,(err)=>{
                                if(err) throw err;
                                else{//new added feature starts from here
                                   //res.send('Transfer Is Successfully');
                                
            connection.query(`insert into Account_${accountNumb} (id,send,rec,amount,date) values(null,'${accountNumb}','${rec_accountNumb}','${fund_amount}','${new Date()}');`,(err)=>{
              if(err) console.log('accounrNumb',err);
              else{
                connection.query(`insert into Account_${rec_accountNumb} (id,send,rec,amount,date) values(null,'${accountNumb}','${rec_accountNumb}','${fund_amount}','${new Date()}');`,(err)=>{
                  if(err) console.log('rec_accountNumb',err);
                  else
                  res.send('Transfer Is Successfully');
                  //console.log(new date())
              })
              }
            })
                                
                                
                                
                                
                                }
                               })
                          }
                        });
                    
                   
                    }
                   
                    else{
                    //res.render('logged',{response:{message:'Sorry!!! Account balance is insufficent'}})
                      res.send('Sorry!!! Account balance is insufficent')
                    }
                }
    
            })
            
            
        }
        else{
          //res.render('logged',{response:{message:'No maching accounts pleace recheck'}});
          res.send('No mached Accounts')
        }
    })
})


amountRouter.route('/history')
.post((req,res)=>{
  var accountNumb=req.body.accountNumb;
  connection.query(`select*from Account_${accountNumb}`,(err,row)=>{
    if(err) throw err
    res.send(row);
  })
})

module.exports=amountRouter;


 




















// amountRouter.route('/show')
// .post((req,res)=>{
//     var pin=req.body.pin;
//     var accountNumb=req.body.accountNumb;
//     var password=req.body.password;

//     var pin_encrypted=Crypto.SHA256(pin).toString();

//     connection.query(`select * from users where accountNumb='${accountNumb}'`,(err,rowU)=>{
//         if(err) throw err;
//         if(rowU.length!=0){
//             if(rowU[0].pin==pin_encrypted){
//             var accountNumb_User=DES.decrypt(accountNumb,password,pin);
//             var name=DES.decrypt(rowU[0].name,password,pin);
//             var bankName=DES.decrypt(rowU[0].bankName,password,pin);
//             var branchName=DES.decrypt(rowU[0].branchName,password,pin);
//             var accountNumb_Amount=DES.encrypt(accountNumb_User,system.key,system.salt)
//             //console.log(`amountAccount ${accountNumb_Amount}`);
//             connection.query(`select * from amountTable where accountNumb='${accountNumb_Amount}'`,(err,rowA)=>{
//                 if(err) throw err;
//                 if(rowA.length!=0){
//                     var amount=des.decrypt( rowA[0].amount,system.key)
//                     res.render('details',{user:{
//                         accountNumb_User,
//                         name,
//                         bankName,
//                         branchName,
//                         amount,
//                     }})
//                 }
//             })
//         }
//         else{
            
//             res.render('index',{invalid_pin:{message:'Invalid Pin Place Relog'}});
//         }
//     }
//     })
// })
























     
const mysql=require('mysql');

const connection=mysql.createConnection({
    host:'localhost',
    password:'',
    user:'root',
    port:3306,
    database:'fund_system'
});

connection.connect((err)=>{
    if(err) throw err;
    console.log('Connect to the database');
})

module.exports=connection;

var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");


var app = express();
app.listen(2001, function () {
  console.log("Server Started...");
})


app.use(express.static("public"));
app.use(fileuploader());

app.get("/hello", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
})

//=========================database=============================

var dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "Samsung@1504",
  database: "project",
  datestrings: true
}


var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (jasoos) {
  if (jasoos == null)
    console.log("connected");
  else
    console.log("not")
})
//============================================


app.post("/dashdonar", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/dashdonar.html");
})

app.get("/db-profile", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/profile.html");
})

app.post("/medmanager", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/medmanager.html");
})

app.post("/needy", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/needy.html");
})


//====================profile form=========================


app.post("/db-signup-process-secure", function (req, resp) {
  console.log(req.body);

  var email = req.body.txtEmail;
  var name = req.body.txtName;
  var contact = req.body.txtcontact;
  var city = req.body.txtcity;
  var date = req.body.txtdob;


  var data = [email, name, contact, city, date];
  dbCon.query("insert into donors values(?,?,?,?,?)", data, function (err) {
    if (err)
      resp.send(err);
    else
      resp.send("Data Saved");
  })
})



//=================delete======================


app.post("/db-delete-process-secure", function (req, resp) {
  //console.log(req.body);

  var email = req.body.txtEmail;



  //var data=[email,name,contact,city,date];
  dbCon.query("delete from donors where email=?", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("accound removed");
      else
        resp.send("invalid email id");

    }
    else resp.send(err);
  })
})

//=========update info================================


app.post("/db-update-process-secure", function (req, resp) {





  var fileName;
  if (req.files != null) {
    //console.log(process.cwd());
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.ppic.mv(path);
  }
  else {
    fileName = req.body.hdn;
  }
  console.log(req.body);
  //resp.send("File name="+fileName);

  //saving data in table
  var email = req.body.txtEmail;
  var password = req.body.txtPwd;
  var dob = req.body.dob;

  //fixed                             //same seq. as in table
  dbCon.query("update donors set password=?,picname=?,dob=? where email=?", [password, fileName, dob, email], function (err) {
    if (err == null)
      resp.send("Record Updated Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
    else
      resp.send(err);
  })




  //==============================file uploading pic========================================================
  //var fileName="nopic.jpg";
  if (req.files != null) {
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.ppic.mv(path);
  }
})
//===========================
app.get("/chk-email", function (req, resp) {
  //console.log(req.body);


//=====================search button======================================

//var data=[email];
dbCon.query("select * from donors where email=?",[req.query.kuchemail],function(err,resulttable){
  if(err==null){
   if(resulttable.length==1)
   resp.send("already taken"); 
   //$(#res).html(reskuch);
 else
 resp.send("available");
 }
 else
 resp.send(err);
})
})
//=============ajax
app.get("/chk-email",function(req,resp)
{
    //saving data in table
   
   
        //fixed                             //same seq. as in table
   dbCon.query("select * from usernew where email=?",[req.query.kuchEmail],function(err,resultTable)
   {
         if(err==null)
         {
           if(resultTable.length==1)
             resp.send("Already Taken... Please change");
           else
             resp.send("Available....!!!!");
           }
             else
           resp.send(err);
   })
})
//================json=========
app.get("/get-json-record",function(req,resp)
{
        //fixed                             //same seq. as in table
   dbCon.query("select * from usernew where email=?",[req.query.kuchEmail],function(err,resultTableJSON)
   {
         if(err==null)
           resp.send(resultTableJSON);
             else
           resp.send(err);
   })
})
//================signup page
app.get("/db-signup", function (req, resp) {

  console.log(req.query);


  var data = [req.query.email, req.query.pwd, req.query.type];
  dbCon.query("insert into usernew values(?,?,?,current_date(),1)", data, function (err) {
    if (err)
      resp.send(err);
    else
      resp.send("Data Saved");
  })
})
app.get("/loginuser", function (req, resp) {
  //console.log(req.body);

  var data=[req.query.EmailL,req.query.pwdL];
 // var type = req.body.txttype;


  //var data = [email, password];
  dbCon.query("select * from usernew where email=? and password=?",data, function (err,resultTable) {
    if (err==null)
      {
        if(resultTable.length==1){
          if(resultTable[0].status==1)
          resp.send("you are loged in");

          else
          resp.send("blocked");
        }
        else
        resp.send("invalid user id/password"); 
      }
      else{
        resp.send(err.toString());
      }
  })
})

//============
app.get("/db-signup", function (req, resp) {
  var data = [req.query.email, req.query.pwd, req.query.type];
  dbRef.query("insert into users value(?,?,?,current_date(),1)", data, function (err) {
    if (err) {
      resp.send("Already a User");
    }
    else {
      resp.send("Sign Up Successfully......");
    }
  });
});

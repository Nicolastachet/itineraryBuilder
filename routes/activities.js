var express = require('express');
var router = express.Router();
const nunjucks = require('nunjucks');
const db = require('../db.js');
//pdf generator
var pdf = require('html-pdf');

// Connexion to S3
// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// config.json is the file with the AWS credentials
AWS.config.loadFromPath('./config.json');

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01',
  params: {Bucket: 'mybhutan-bucket1'} // This bucket needs to exist to be called
  });

// Call S3 to list current buckets --> make sure the bucket you want to use is listed
s3.listBuckets(function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log("Bucket List", data.Buckets);
   }
});

// List all the activities
router.get('/listactivity', db.getAllActivities, (req, res) => {
var bool = req.query["valid"]
var bool2 = req.query["valid2"]
  const activities = [];
  for(var i=0; j=res.rows.length,i<j; i++){
    activities.push([res.rows[i].name,res.rows[i].cost,res.rows[i].price,res.rows[i].id,res.rows[i].category]) ;
  }
  res.render('agencies/activity/listAct', {activities: activities, bool_remove: bool, bool_update:bool2})
});

// Add an activity form
router.get('/addActi', (req,res) => {
  db.setSequence
  res.render('agencies/activity/addActivity')
})
router.post('/activity', db.createActivity, (req,res) => {
    res.redirect('/listactivity')
});

// Modify an activity form
router.get('/activity/modify/:id', db.getSingleActivity, (req,res) =>{
  res.render("agencies/activity/modifyActivity", {id: res.rows.id, name: res.rows.name, category:res.rows.category, price:res.rows.price, cost:res.rows.cost})
})

router.post('/activity/:id', db.updateActivity, (req,res) =>{
  var string = encodeURIComponent('true');
  res.redirect('/listactivity/?valid2='+string)
});

// Delete an activity form
router.get('/activity/delete/:id', db.removeActivity, (req,res) =>{
  var string = encodeURIComponent('true');
  res.redirect('/listactivity/?valid='+string)
});


// Test upload route
// We configured a form split.html, on a post request it generates the pdf and upload it to AWS
router.post('/testupload', function(req,res){

  // Collect data from the split made by the agency (split.hmtl) --> dummy data
  var name = req.body.name;
  var date_of_arrival = req.body.date;
  var amount = req.body.amount;

  // Date of today
  var now = new Date();
  var year   = now.getFullYear();
  var month    = now.getMonth() + 1;
  var day    = now.getDate();
  var nowDate = month+'/'+day+'/'+year;

  // Using nunjucks, fill the bill.html template with the dummy data of the form
  var renderedHTML = nunjucks.render('agencies/bill.html',{name:name, date:date_of_arrival, amount:amount, nowDate:nowDate})
  // setting options
  var options = { height: "11in",width: "8.5in"};

  // We create the pdf and stream it
  pdf.create(renderedHTML,options).toStream(function(err,stream){
    if(err) return console.log(err);

    // Change the name of the bucket if necessary
    var uploadParams = {Bucket: 'mybhutan-bucket1', Key: '', Body: ''};
    // name of the file
    var id = now.getTime().toString()
    var file = 'bill_'+id+'.pdf';
    var fileStream = stream;
    uploadParams.Body = fileStream;
    uploadParams.Key = file;

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err);
        //res.render('agencies/error');
      } if (data) {
        console.log("Upload Success", data.Location);
        //res.render('agencies/success');
      }
  });

    // We need to store those id in a DB to retrieve easily
    // A report is made of: id, name, date of arrival, now_date, amount
  db.query('INSERT INTO Report(id, name, amount, date, date_of_arrival) VALUES($1,$2,$3,$4,$5) RETURNING id',[id, name, amount, nowDate, date_of_arrival], function(error, results){
    if (error) {
      throw error
      res.render('agencies/error');
    } else {
      res.render('agencies/success')
    }
  });

  });
});

module.exports = router

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
  params: {Bucket: 'mybhutan-bucket1'}
  });

router.get('/', db.getAllReports, (req,res) =>{
  var bool = req.query["valid"]
  const reports = [];
  for(var i=0; j=res.rows.length,i<j; i++){
    reports.push([res.rows[i].id,res.rows[i].name,res.rows[i].amount, res.rows[i].date_of_arrival]) ;
  }
  res.render('agencies/report/listReport', {reports:reports, bool_remove:bool})
})

router.get('/delete/:id', db.removeReport, (req,res) =>{
  fileKey = 'bill_'+req.params.id.slice(1)+'.pdf'
  console.log(fileKey)
  var params = {
        Bucket    : 'mybhutan-bucket1',
        Delete: { // required
    Objects: [
      {
        Key: fileKey // required
      }
    ],
  },
    };
  s3.deleteObjects(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        var string = encodeURIComponent('true');
        res.redirect('/reports/?valid='+string)
    }

})
})

module.exports = router

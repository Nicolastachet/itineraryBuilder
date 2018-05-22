var express = require('express');
var router = express.Router();
const nunjucks = require('nunjucks');
const db = require('../db.js');
//pdf generator
var pdf = require('html-pdf');

router.get('/', (req,res) =>{
  res.render('agencies/itinerary/menu')
})

router.get('/builder1', db.getAllCustomers, (req, res)=> {
  customers = []
  for(var i=0; j=res.rows.length,i<j; i++){
    customers.push([res.rows[i].name,res.rows[i].id,res.rows[i].email]) ;
  }
  res.render('agencies/itinerary/builder1', {customers: customers})
})

router.post('/customer', (req,res) => {
  start = req.body.start.replace('-','').replace('-','')
  db.getSingleCustomerByName(req).then((data) => {
    id = data.id
    var string = encodeURIComponent(id);
    var string_date = encodeURIComponent(start)
      res.redirect('/itinerary/todo/:'+string+'&:'+string_date)
  })
  })

router.get('/todo/:id&:start', (req,res) => {
  customer_id = parseInt(req.params.id.slice(1))
  start = parseInt(req.params.start.slice(1))
  string = req.params.start.slice(1)
  start_date = string.substring(0,4)+'/'+string.substring(4,6)+'/'+string.substring(6,8)

  db.getSingleCustomerByID(customer_id).then( (data)=>{
    db.getAllActivities2().then((result)=>{
      const activities = [];
      for(var i=0; j=result.length,i<j; i++){
        activities.push([result[i].name,result[i].cost,result[i].price,result[i].id,result[i].category]) ;
      }
      db.getAllTodosbyCustomerID(customer_id).then( (todos)=>{
        if(todos.length == 0){
          res.render('agencies/itinerary/builder2', {customer_name: data.name, customer_id: customer_id, activities: activities, start:start, start_date:start_date})
        }else{
          product =[]
          db.getAllTodosbyCustomerID(customer_id).then( (todos)=>{
            for(var k=0; l=todos.length, k<l; k++){
              act_id = todos[k].activity_id
              day = todos[k].day
              todos_id = todos[k].id

              for (var m=0; n=result.length, m<n; m++){
                if (result[m].id == act_id){
                  product.push([activities[m],day])
                  product.sort(function(a,b){return a[1]-b[1]})
                }
              }
            }
            res.render('agencies/itinerary/builder2', {customer_name: data.name, customer_id: customer_id, activities: activities, start:start, todos:product, start_date:start_date, todos_id:todos_id} )

        })
    }
  })
})
})
})

router.post('/todo/:id&:start', (req,res) => {
  customer_id = parseInt(req.params.id.slice(1))
  start = parseInt(req.params.start.slice(1))
  string = req.params.start.slice(1)
  start_date = string.substring(0,4)+'/'+string.substring(4,6)+'/'+string.substring(6,8)
  activity = req.body.activity
  day = parseInt(req.body.day)

  db.getSingleActivityIdByName(activity).then( (activity_id) =>{
    activity_id = parseInt(activity_id.id)
    db.addActivityToTodo(customer_id,activity_id,start,day).then((data)=>{
      db.getSingleCustomerByID(customer_id).then( (data2)=>{
        db.getAllActivities2().then((result)=>{
          const activities = [];
          for(var i=0; j=result.length,i<j; i++){
            activities.push([result[i].name,result[i].cost,result[i].price,result[i].id,result[i].category]) ;
          }
          product = []
          db.getAllTodosbyCustomerID(customer_id).then( (todos)=>{
            if (todos.length == 0){
              res.render('agencies/itinerary/builder2', {customer_name: data.name, customer_id: customer_id, activities: activities, start:start, start_date:start_date} )
            }else{
                      for(var k=0; l=todos.length, k<l; k++){
                        act_id = todos[k].activity_id
                        day = todos[k].day
                        todos_id = todos[k].id
                        for (var m=0; n=result.length, m<n; m++){
                          if (result[m].id == act_id){
                            product.push([activities[m],day])
                            product.sort(function(a,b){return a[1]-b[1]})
                          }
                        }
                      }
                      res.render('agencies/itinerary/builder2', {customer_name: data2.name, customer_id: customer_id, activities: activities, start:start, todos: product,start_date:start_date, todos_id:todos_id})
}
        })
      })
    })
  })
})
})

// Delete an activity
router.get('/todo/delete/:id&:start&:todos', (req,res) => {
  db.removeTodo(parseInt(req.params.todos.slice(1)))
  customer_id = parseInt(req.params.id.slice(1))
  start = parseInt(req.params.start.slice(1))
  string = req.params.start.slice(1)
  start_date = string.substring(0,4)+'/'+string.substring(4,6)+'/'+string.substring(6,8)

  db.getSingleCustomerByID(customer_id).then( (data)=>{
    db.getAllActivities2().then((result)=>{
      const activities = [];
      for(var i=0; j=result.length,i<j; i++){
        activities.push([result[i].name,result[i].cost,result[i].price,result[i].id,result[i].category]) ;
      }
      db.getAllTodosbyCustomerID(customer_id).then( (todos)=>{
        if(todos.length == 0){
          res.render('agencies/itinerary/builder2', {customer_name: data.name, customer_id: customer_id, activities: activities, start:start, start_date:start_date})
        }else{
          product =[]
          db.getAllTodosbyCustomerID(customer_id).then( (todos)=>{
            for(var k=0; l=todos.length, k<l; k++){
              act_id = todos[k].activity_id
              day = todos[k].day
              todos_id = todos[k].id

              for (var m=0; n=result.length, m<n; m++){
                if (result[m].id == act_id){
                  product.push([activities[m],day])
                  product.sort(function(a,b){return a[1]-b[1]})
                }
              }
            }
            res.render('agencies/itinerary/builder2', {customer_name: data.name, customer_id: customer_id, activities: activities, start:start, todos:product, start_date:start_date, todos_id:todos_id} )

        })
    }
  })
})
})
});

// Generate the Report
// Connexion to S3
// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// config.json is the file with the AWS credentials
AWS.config.loadFromPath('./config.json');

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01',
  params: {Bucket: 'mybhutan-bucket1'}
  });

// Call S3 to list current buckets --> make sure the bucket you want to use is listed
s3.listBuckets(function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log("Bucket List", data.Buckets);
   }
});

// Test upload route
// We configured a form split.html, on a post request it generates the pdf and upload it to AWS


router.get('/todo/generate/:id&:start', (req,res) => {
  customer_id = parseInt(req.params.id.slice(1))
  start = parseInt(req.params.start.slice(1))
  string = req.params.start.slice(1)
  start_date = string.substring(0,4)+'/'+string.substring(4,6)+'/'+string.substring(6,8)
  activity = req.body.activity
  day = parseInt(req.body.day)

  db.getSingleCustomerByID(customer_id).then( (data)=>{
    db.getAllActivities2().then((result)=>{
      const activities = [];
      for(var i=0; j=result.length,i<j; i++){
        activities.push([result[i].name,result[i].cost,result[i].price,result[i].id,result[i].category]) ;
      }
      db.getAllTodosbyCustomerID(customer_id).then( (todos)=>{
        if(todos.length == 0){
          // nothing to generate
          res.render('agencies/itinerary/builder2', {customer_name: data.name, customer_id: customer_id, activities: activities, start:start, start_date:start_date})
        }else{
          product =[]
          total_price = []
          db.getAllTodosbyCustomerID(customer_id).then( (todos)=>{
            for(var k=0; l=todos.length, k<l; k++){
              act_id = todos[k].activity_id
              day = todos[k].day
              todos_id = todos[k].id

              for (var m=0; n=result.length, m<n; m++){
                if (result[m].id == act_id){
                  total_price.push(parseFloat(result[m].price))
                  product.push([activities[m],day])
                  product.sort(function(a,b){return a[1]-b[1]})
                }
              }
            }
            total_price = total_price.reduce(function(a, b) { return a + b; }, 0)
            // Date of today
            var now = new Date();
            var year   = now.getFullYear();
            var month    = now.getMonth() + 1;
            var day    = now.getDate();
            var nowDate = month+'/'+day+'/'+year;

            // Using nunjucks, fill the bill.html template with the dummy data of the form
            var renderedHTML = nunjucks.render('agencies/bill.html',{products: product, customer_id: customer_id, name:data.name, start_date:start_date, total_price:total_price, nowDate:nowDate})
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
              s3.upload (uploadParams, function (err, data3) {
                if (err) {
                  console.log("Error", err);
                  report_created = false
                  res.render('agencies/itinerary/builder2', {customer_name: data.name, customer_id: customer_id, activities: activities, start:start, todos:product, start_date:start_date, todos_id:todos_id, report_created:report_created, nowDate:nowDate} )
                } if (data) {
                  console.log("Upload Success", data3.Location);
                  report_created = true
                  report_data = [id, data.name, total_price, nowDate, start_date]

                  db.addReport(report_data).then( (data4)=> {
                    res.render('agencies/itinerary/builder2', {customer_name: data.name, customer_id: customer_id, activities: activities, start:start, todos:product, start_date:start_date, todos_id:todos_id, report_created: report_created, nowDate:nowDate, date_of_the_day:id} )

                  })
                          }
})
})
})
}
})
})
})
})

router.get('/todo/download/:date', (req,res) =>{
  fileKey = 'bill_'+req.params.date.slice(1)+'.pdf'
  console.log(fileKey)
  var options = {
        Bucket    : 'mybhutan-bucket1',
        Key    : fileKey,
    };
  res.attachment(fileKey);
  var fileStream = s3.getObject(options).createReadStream();
  fileStream.pipe(res);
})



module.exports = router

var express = require('express');
var router = express.Router();
const nunjucks = require('nunjucks');
const db = require('../db.js');
//pdf generator
var pdf = require('html-pdf');


// List all the activities
router.get('/listcustomer', db.getAllCustomers, (req, res) => {
var bool = req.query["valid"]
var bool2 = req.query["valid2"]
  const customers = [];
  for(var i=0; j=res.rows.length,i<j; i++){
    customers.push([res.rows[i].name,res.rows[i].id,res.rows[i].email]) ;
  }
  res.render('agencies/customer/listCustomer', {customers: customers, bool_remove: bool, bool_update:bool2})
});

// Add an activity form
router.get('/addCustomer', (req,res) => {
  db.setSequenceCustomer
  res.render('agencies/customer/addCustomer')
})
router.post('/', db.createCustomer, (req,res) => {
    res.redirect('/customer/listcustomer')
});

// Modify an activity form
router.get('/modify/:id', db.getSingleCustomer, (req,res) =>{
  res.render("agencies/customer/modifyCustomer", {id: res.rows.id, name: res.rows.name, email:res.rows.email})
})

router.post('/:id', db.updateCustomer, (req,res) =>{
  var string = encodeURIComponent('true');
  res.redirect('/customer/listcustomer/?valid2='+string)
});

// Delete an activity form
router.get('/delete/:id', db.removeCustomer, (req,res) =>{
  var string = encodeURIComponent('true');
  res.redirect('/customer/listcustomer?valid='+string)
});
module.exports = router

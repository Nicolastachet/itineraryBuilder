var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options)
var connectionString = "";

var db = pgp(connectionString)

// Functions for activities/Products

function getAllActivities(req, res, next) {
  db.any('select * from activities')
    .then( (data) => {
      res.rows = data;
      next();
    })
    .catch( (err) => {
      console.log(err);
        });
}

function getAllActivities2(){
  return new Promise((resolve, reject) => {
  db.any('select * from activities')
    .then( (data) => {
      resolve(data)
    })
    .catch( (err) => {
      reject(err);
        });
})
}

function setSequence(req,res, next){
  db.query("SELECT setval('public.activities_id_seq', COALESCE((SELECT MAX(id)+1 FROM activities), 1), false)")//.then( (data) => {res.rows = data; next();}).catch( (err) => {console.log(err);});
}

function getSingleActivity(req, res, next) {
  var activityID = parseInt(req.params.id.slice(1));
  db.one('select * from activities where id = $1', activityID)
    .then( (data) => {
      res.rows = data;
      next();
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleActivityIdByName(req) {
  var activity_name = req;
  return new Promise((resolve, reject) => {
  db.one('select id from activities where name = $1', activity_name)
    .then( (data) => {
      resolve(data)
    })
    .catch(function (err) {
      reject(err)
    });
  })
}

function getSingleActivityNamebyID(req) {
  var activity_id = req;
  return new Promise((resolve, reject) => {
  db.one('select name from activities where id = $1', activity_id)
    .then( (data) => {
      resolve(data)
    })
    .catch(function (err) {
      reject(err)
    });
  })
}

function getSingleActivitybyID(req){
  var activity_ID = req;
  return new Promise((resolve, reject) => {
  db.one('select * from activities where id = $1', activity_ID)
    .then( (data) => {
      resolve(data)
    })
    .catch(function (err) {
      reject(err)
    });
  })
}

function createActivity(req, res, next) {
  db.none('insert into activities(name, cost, price, category)' +
      'values(${name}, ${cost}, ${price}, ${category})',
    req.body)
      .then(function () {
        next();
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateActivity(req, res, next) {
  db.none('update activities set name=$1, cost=$2, price=$3, category=$4 where id=$5',
    [req.body.name, parseInt(req.body.cost), parseInt(req.body.price),req.body.category,parseInt(req.params.id.slice(1))])
    .then(function () {
      next();
  })
    .catch(function (err) {
      return next(err);
    });
}

function removeActivity(req, res, next) {
  var activityID = parseInt(req.params.id.slice(1));
  db.result('delete from activities where id = $1', activityID)
  .then( (data) => {
    res.rows = data;
    next();
  })
    .catch(function (err) {
      return next(err);
    });
}

function getAllActivitiesByName_typeahead(req){
  req = '%'+req+'%'
  return new Promise((resolve, reject) => {
    db.any("select * from activities where name like ($1) order by name", req).then( (data) => {
      resolve(data)
    })
    .catch(function(err){
      reject(err)
    })
  })
}

// Function for customers

function getAllCustomers(req, res, next) {
  db.any('select * from customers order by name')
    .then( (data) => {
      res.rows = data;
      next();
    })
    .catch( (err) => {
      console.log(err);
        });
}

function setSequenceCustomer(req,res, next){
  db.query("SELECT setval('public.customers_id_seq', COALESCE((SELECT MAX(id)+1 FROM customers), 1), false)")//.then( (data) => {res.rows = data; next();}).catch( (err) => {console.log(err);});
}

function getSingleCustomer(req, res, next) {
  var activityID = parseInt(req.params.id.slice(1));
  db.one('select * from customers where id = $1', activityID)
    .then( (data) => {
      res.rows = data;
      next();
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleCustomerByName(req) {
  name = req.body.customer
  return new Promise((resolve, reject) => {

  db.one('select * from customers where name = $1', name).then( (data) =>{
    resolve(data)
  })
  .catch(function(err){
    reject(err)
  })
})
}

function getSingleCustomerByID(req) {
  id = parseInt(req)
  return new Promise((resolve, reject) => {

  db.one('select * from customers where id = $1', id).then( (data) =>{
    resolve(data)
  })
  .catch(function(err){
    reject(err)
  })
})
}

function createCustomer(req, res, next) {
  db.none('insert into customers(name, email)' +
      'values(${name}, ${email})',
    req.body)
      .then(function () {
        next();
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateCustomer(req, res, next) {
  db.none('update customers set name=$1, email=$2 where id=$3',
    [req.body.name, req.body.email, parseInt(req.params.id.slice(1))])
    .then(function () {
      next();
  })
    .catch(function (err) {
      return next(err);
    });
}

function removeCustomer(req, res, next) {
  var customerID = parseInt(req.params.id.slice(1));
  db.result('delete from customers where id = $1', customerID)
  .then( (data) => {
    res.rows = data;
    next();
  })
    .catch(function (err) {
      return next(err);
    });
}


// Functions for activities/Products

function getAllTodos(req, res, next) {
  db.any('select * from todos')
    .then( (data) => {
      res.rows = data;
      next();
    })
    .catch( (err) => {
      console.log(err);
        });
}

function setSequenceTodo(req,res, next){
  db.query("SELECT setval('public.todos_id_seq', COALESCE((SELECT MAX(id)+1 FROM todos), 1), false)")//.then( (data) => {res.rows = data; next();}).catch( (err) => {console.log(err);});
}

function getSingleTodoByCustomer(req, res, next) {
  var customerID = parseInt(req.params.id.slice(1));
  db.one('select * from todos where id = $1', customerID)
    .then( (data) => {
      res.rows = data;
      next();
    })
    .catch(function (err) {
      return next(err);
    });
}

function addActivityToTodo(customer_id,activity_id,start,day) {
  return new Promise((resolve, reject) => {
  db.none("INSERT INTO todos (customer_id, activity_id, start_date, day) VALUES ($1,$2,$3,$4)",[customer_id,activity_id,start,day])
  .then( (data)=>{
  resolve(data)
})
    .catch(function (err) {
      reject(err);
    });
})
}

function getAllTodosbyCustomerID(customer_id){
  return new Promise((resolve, reject) => {
    db.any('select * from todos WHERE customer_id = ($1)',customer_id)
    .then( (data)=>{
    resolve(data)
    })
      .catch(function (err) {
        reject(err);
      });
})
}

function removeTodo(todoID) {
  return new Promise((resolve, reject) => {
  db.result('delete from todos where id = $1', todoID)
  .then( (data) => {
    resolve(data)
  })
    .catch(function (err) {
      reject(err);
    });
})
}

// Manage Reports

function addReport(report_data) {
  return new Promise((resolve, reject) => {
  db.none("INSERT INTO report (id, name, amount, date_of_arrival) VALUES ($1,$2,$3,$4)",[parseInt(report_data[0]),report_data[1],parseFloat(report_data[2]),report_data[3]])
  .then( (data)=>{
  resolve(data)
})
    .catch(function (err) {
      reject(err);
    });
})
}

function getAllReports(req, res, next) {
  db.any('select * from report order by name')
    .then( (data) => {
      res.rows = data;
      next();
    })
    .catch( (err) => {
      console.log(err);
        });
}

function removeReport(req, res, next) {
  var reportID = parseInt(req.params.id.slice(1));
  db.result('delete from report where id = $1', reportID)
  .then( (data) => {
    res.rows = data;
    next();
  })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  getAllActivities: getAllActivities,
  getSingleActivity: getSingleActivity,
  createActivity: createActivity,
  updateActivity: updateActivity,
  setSequence: setSequence,
  removeActivity: removeActivity,
  getSingleActivityIdByName: getSingleActivityIdByName,
  getSingleActivityNamebyID: getSingleActivityNamebyID,
  getSingleActivitybyID: getSingleActivitybyID,
  getAllActivitiesByName_typeahead: getAllActivitiesByName_typeahead,

  getAllCustomers: getAllCustomers,
  getSingleCustomer: getSingleCustomer,
  createCustomer: createCustomer,
  getSingleCustomerByName: getSingleCustomerByName,
  updateCustomer: updateCustomer,
  setSequenceCustomer: setSequenceCustomer,
  removeCustomer: removeCustomer,

  setSequenceTodo: setSequenceTodo,
  getAllTodos: getAllTodos,
  getSingleCustomerByID: getSingleCustomerByID,
  getAllActivities2: getAllActivities2,
  addActivityToTodo: addActivityToTodo,
  getSingleTodoByCustomer: getSingleTodoByCustomer,
  getAllTodosbyCustomerID:getAllTodosbyCustomerID,
  removeTodo:removeTodo,

  addReport: addReport,
  getAllReports:getAllReports,
  removeReport:removeReport

}

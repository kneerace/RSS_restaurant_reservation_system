const tableService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for tables list
 */
async function list(req, res) {
  const data = await tableService.list();
    res.json({data});
  }

// check reqest has data property and if exists at least 2 of them
async function requestHasData(req, res, next){
  if(!req.body.data){
    return next({
      status: 400,
      message: `Mising data from the request body.`,
    });
  }
  if (Object.keys(req.body.data).length < 2){
    return next({
      status: 400,
      message: `Request data has insufficient properties`,
    })
  }
  next();
}
// check if request has property and value
function reqBodyHas(propertyName){
  return function(req, res, next){
      const {data ={} } = req.body;
      if(data[propertyName]){
          return next();
      }
      next({ status: 400, 
          message : `Reservation request must include "${propertyName}"`
      });
  };
}
// -------TABLE NAME CHECK
  //  1.check if table_name is valid 
function isTableNameValid(req, res, next){
   res.locals.table_name = req.body.data.table_name;
  
  if(res.locals.table_name.length < 2){
    return next({
      status: 400,
      message:`Table Name Must be at least 2 Char in length`,
    });
  }
  next();
}

  // CAPACITY CHECK 
  // 1. is capacity valid 
   //  1.check if table_name is valid 
function isCapacityValid(req, res, next){
    res.locals.capacity = req.body.data.capacity;
   
   if(res.locals.capacity < 1){
     return next({
       status: 400,
       message:`Must have some capacity, can't be less than 1`,
     });
   }
   next();
 }
  

// ---- CREATE
 async function create(req, res, next){
  const tableDetails = req.body.data;
  tableService.create(tableDetails)
      .then((data)=> res.status(201).json({data}))
      .catch(next); 
}

module.exports = {
  list: asyncErrorBoundary(list),
  create :[
    requestHasData,
    reqBodyHas("table_name"),
    reqBodyHas("capacity"),
    isTableNameValid,
    isCapacityValid,
    asyncErrorBoundary(create),
  ], 
  
};

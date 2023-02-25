const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for tables list
 */
async function list(req, res) {
  const data = await tablesService.list();
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
    // console.log("reqBodyHas:: req  ", req.body)
      const {data ={} } = req.body;
      // console.log("reqBodayHas:::  ", data)
      if(data[propertyName]){
          return next();
      }
      next({ status: 400, 
          message : `Table request must include "${propertyName}"`
      });
  };
}
// -------TABLE CHECK
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

  // 2. is capacity valid 
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
 // 3. do table exists 
async function tableIdExists(req, res, next){
  const {table_id} = req.body.data;
  const table = await tablesService.read(table_id);
  if(table){
    res.locals.table_id = table.table_id;
    return next();
  }
  next({
    status: 404, 
    message: `Table with ID ${table_id} does not exist`,
  });
};

// ---- CREATE
 async function create(req, res, next){
  const tableDetails = req.body.data;
  tablesService.create(tableDetails)
      .then((data)=> res.status(201).json({data}))
      .catch(next); 
}

// updte table
async function update(req, res, next){
  const table_id = res.locals.table_id
  await tablesService.update(table_id);
  res.status(200).json({});
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
  update:[
    reqBodyHas("table_id"), 
    tableIdExists,
    asyncErrorBoundary(update),
  ]
  
};

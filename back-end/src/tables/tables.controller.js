const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { userParams } = require("../db/connection");
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
  // if (Object.keys(req.body.data).length < 2){
  //   return next({
  //     status: 400,
  //     message: `Request data has insufficient properties`,
  //   })
  // }
  next();
}
// check if request has property and value
function reqBodyHas(propertyName){
  return function(req, res, next){
    // console.log("reqBodyHas:: req  ", req.body)
      const {data ={} } = req.body;
      // console.log("reqBodayHas:::  ", data); //-----------------
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
      message:`table_name Must be at least 2 Char in length`,
    });
  }
  next();
}
 function isCapacityNumber(req, res, next){
  const {capacity} = req.body.data;

  if(typeof(capacity)!='number'){
    return next({
      status: 400, 
      message: ` capacity should be numerical`,
    })
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
  // console.log(' tableIdExists:: params:::: ', req.params); //---------------
  const {table_id}= req.params;
  const table = await tablesService.read(table_id);
  // console.log("\t\n tableIdEsists:::: ", table);  //---------------
  if(table){
    res.locals.table_id = table.table_id;
    res.locals.table = table;
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

// reserve table
async function reserveTable(req, res, next){
  const table_id = res.locals.table_id;
  const reservation_id = req.body.data.reservation_id;

  await reservationsService.updateStatus(reservation_id, "seated")
    .then(await tablesService.reserveTable(table_id, reservation_id))
    .then((data)=> res.status(200).json({data}))
    .catch(next); 
}



async function reservationExists(req, res, next){
  const {reservation_id} = req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  // console.log('\t\n reservationExists::: ', reservation);  //---------------
      if(reservation){
        res.locals.reservation = reservation;
        return next();
      }
      next({
        status: 404, 
        message: `Reservation with ID ${reservation_id} does not exist`,
      });
}

function reservationStatus(req, res, next){
  const {status} = res.locals.reservation;
  // console.log("\t\n reservationStatus::: ", status); //-----------------

  if(status != "booked"){
    // console.log(' inside reservationStatus IF: ', status,   status!="booked"); //-------------
    return next({
        status: 400, 
        message:`Reservation is ${status}`,
      })
   }
  next();
}

async function isTableFree(req, res, next){
  const table_reservation_id = res.locals.table.reservation_id;

  if(table_reservation_id){
    return next({status: 400, 
        message:`Table is occupied`,
      })
  }
  // console.log("\t\n isTAbleReserved:::: ", table_reservation_id); //------------------
  next();
}

async function isTableOccupied(req, res, next){
  const table_reservation_id = res.locals.table.reservation_id;

  if(!table_reservation_id){
    return next({status: 400, 
        message:`Table is not occupied`,
      })
  }
  // console.log("\t\n isTableOccupied:::: ", table_reservation_id); //------------------
  next();
}

async function satisfyCapacity(req, res, next){
  const people = res.locals.reservation.people;
  const capacity = res.locals.table.capacity;
  
  if(people > capacity){
    return next({status: 400, 
        message:`Table capacity: ${capacity} is less than the number of people (${people}) in reservation`,
      })
  }
  // console.log("\t\n satisfyCapacity::: ", people, '  capacity:::', capacity); //-----------------
  next();
}

async function resetTable(req, res, next){
  const {table_id, reservation_id} = res.locals.table;
  // console.log('resetTable:::::', table_id, '  ::: reservation::: ', reservation_id); //----------------
  await reservationsService.updateStatus(reservation_id, "finished")
    .then(await tablesService.resetTable(table_id))
    .then((data)=> res.status(200).json({data}))
    .catch(next); 
}


module.exports = {
  list: asyncErrorBoundary(list),
  create :[
    asyncErrorBoundary(requestHasData),
    asyncErrorBoundary(reqBodyHas("table_name")),
    asyncErrorBoundary(reqBodyHas("capacity")),
    asyncErrorBoundary(isTableNameValid),
    asyncErrorBoundary(isCapacityNumber),
    asyncErrorBoundary(isCapacityValid),
    asyncErrorBoundary(create),
  ],
  update:[
    asyncErrorBoundary(reqBodyHas("table_id")), 
    asyncErrorBoundary(tableIdExists),
    asyncErrorBoundary(update),
  ], 
  reserveTable:[
    asyncErrorBoundary(reqBodyHas("reservation_id")),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(reservationStatus),
    asyncErrorBoundary(tableIdExists),
    asyncErrorBoundary(isTableFree),
    asyncErrorBoundary(satisfyCapacity), 
    asyncErrorBoundary(reserveTable),
  ],
  resetTable:[
    asyncErrorBoundary(tableIdExists),
    asyncErrorBoundary(isTableOccupied),
    asyncErrorBoundary(resetTable),
  ]
};

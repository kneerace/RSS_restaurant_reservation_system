const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
      reservationsService.list()
      .then((data)=> res.json({data}))
      .catch(next);
}

// check reqest has data property and if exists at least 6 of them
async function requestHasData(req, res, next){
  if(!req.body.data){
    return next({
      status: 400,
      message: `Mising data from the request body.`,
    });
  }
  if (Object.keys(req.body.data).length < 6){
    return next({
      status: 400,
      message: `Request data has insufficient properties`,
    })
  }
  next();
}
// check if request has property as 
function reqBodyHas(propertyName){
  return function(req, res, next){
      const {data ={} } = req.body;
      if(data[propertyName]){
          // console.log("reqBodyHas:::propertyName::::", propertyName);
          return next();
      }
      next({ status: 400, 
          message : `Reservation request must include "${propertyName}"`
      });
  };
}
// -------DATE CHECK
  //  1.check if date is valid 
function isDateValid(req, res, next){
   res.locals.reservation_date = req.body.data.reservation_date;
  let inputDate = new Date(res.locals.reservation_date).toString(); // converting to String for comparison
  if(inputDate === 'Invalid Date'){
    return next({
      status: 400,
      message:`Reservation Date is Invalid`,
    });
  }
  next();
}

// 2.check if date is tuesday, Restaurant closed
async function dateIsRestaurantClosedDate ( req, res, next){
  let res_date = new Date(res.locals.reservation_date);
  console.log("res_date: ", res_date);
  console.log("getDay: ", res_date.getUTCDay());

    if(res_date.getUTCDay() == 2){
      return next({
        status: 400,
        message: `Restaurant is Closed on Tuesday.`,
        });
      }
    next();
};
  // 3. date in future
  function dateInFuture(req, res, next){
    const {reservation_date, reservation_time}= req.body.data;
    let inputDateTime = `${reservation_date}${reservation_time}`
    const todayDateTime = new Date();
    inputDateTime = new Date(inputDateTime);
    console.log('today ', todayDateTime, '\n inputDateTime ', inputDateTime);
    if(inputDateTime < todayDateTime){
      return next({status: 400
        , message: `Reservation DateTime should be in future`,
       });
    }
    next();
  }

async function create(reservation){
  console.log( 'this is it ') ;
  return "this is it "
}
module.exports = {
  list: asyncErrorBoundary(list),
  create :[
    requestHasData,
    reqBodyHas("first_name"),
    reqBodyHas("last_name"),
    reqBodyHas("mobile_number"), 
    reqBodyHas("reservation_date"), 
    reqBodyHas("reservation_time"), 
    reqBodyHas("people"),
    isDateValid,
    dateInFuture,
    dateIsRestaurantClosedDate,
    // timeWithInRestaurantHours(),
    asyncErrorBoundary(create),
    
  ]
};

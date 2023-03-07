const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const date = req.query.date;
  const {mobile_number} = req.query;
  
    let data = null;
    try{
      if(date){
        data = await reservationsService.listByDate(date);
      }
      else if (mobile_number){
        data = await reservationsService.listByMobileNumber(mobile_number);
      }
      else{
        data = await  reservationsService.list();
      }
      res.json({data});
    }
    catch (error){
      console.log(error);
    }
  }

// check reqest has data property and if exists at least 6 of them
async function requestHasData(req, res, next){
  if(!req.body.data){
    return next({
      status: 400,
      message: `Mising data from the request body.`,
    });
  }
  // if (Object.keys(req.body.data).length < 6){
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
      const {data ={} } = req.body;
      if(data[propertyName]){
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
      message:`reservation_date is Invalid`,
    });
  }
  next();
}

// 2.check if date is tuesday, Restaurant closed
async function dateIsRestaurantClosedDate ( req, res, next){
  let res_date = new Date(res.locals.reservation_date);

    if(res_date.getUTCDay() == 2){
      return next({
        status: 400,
        message: `Restaurant is closed on Tuesday.`,
        });
      }
    next();
};
  // 3. date in future
  function dateInFuture(req, res, next){
    const {reservation_date, reservation_time}= req.body.data;
    let inputDateTime = `${reservation_date} ${reservation_time}`
    const todayDateTime = new Date();
    inputDateTime = new Date(inputDateTime);
    
    if(inputDateTime < todayDateTime){
      return next({status: 400
        , message: `Reservation DateTime should be in future`,
       });
    }
    next();
  }

  // TIME CHECK 
  // 1. is time valid 
  async function isTimeFormatValid(req, res, next){
    res.locals.reservation_time = req.body.data.reservation_time;
    // const timeFormat = /^(2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/;
    const timeFormat = /^(2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
    if(timeFormat.test(res.locals.reservation_time)){
      return next();
    }
    return next({
      status:400,
      message:`reservation_time Format is InValid`,
    });
  }
  // 2. time within restaurant hour 10:30 am to 9:30 PM 
  async function timeWithInRestaurantHours(req, res, next){
        const reservationTime = res.locals.reservation_time;
        const restaurantReservationHours = {start: "10:29:59", end: "21:30:00"};

        if(reservationTime > restaurantReservationHours.start && reservationTime < restaurantReservationHours.end){
          return next();
        }
        return next({
          status: 400, 
          message:`Reservation Time between 10:30AM to 9:30PM.`,
        })
    }
// Phone validation
async function isPhoneValid(req, res, next){
  const validPhoneRegEx = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/ ;
  const {mobile_number} = req.body.data;
  if(mobile_number.match(validPhoneRegEx)[0]){
    return next();
  }
  next({
    status:400, 
    message:`Phone number is not valid, please input digit.`,
  });
}

async function isPeopleNumber(req, res, next){
  const {people} = req.body.data;
  // console.log("isPeopleNumber:: ", people, '::: ', typeof(people));
  if(typeof(people)!== "number"){
    return next({
      status: 400,
      message: `people is not a number`,
    });
  }
  next();
}

  async function reservationExists(req, res, next){
      const {reservation_id} = req.params;
      const reservation = await reservationsService.read(reservation_id);
      if(reservation){
        res.locals.reservation = reservation;
        return next();
      }
      next({
        status: 404, 
        message: `Reservation with ID ${reservation_id} does not exist`,
      });
  };

  async function validStatus (req, res, next){
    const {status } = req.body.data;
    const validStatus = ['booked','seated','finished','cancelled'];

    // console.log(validStatus.includes(status));
    if(validStatus.includes(status)){
      return next();
      }
      next({
        status: 400, 
        message: `${status} is not a valid status`,
      });
  };

  async function isNotFinishedStatus(req, res, next){
    const existing_status = res.locals.reservation.status;
    if(existing_status == "finished"){
      return next({
        status: 400,
        message:`finished status cannot be updated`,
      })
    }
    next();
  }

async function updateStatus(req, res, next){
  const {reservation_id} = req.params;
  const {status} = req.body.data;

  reservationsService.updateStatus(reservation_id, status)
    .then((status)=> res.status(200).json({data:{status}}))
    .catch(next);
}

async function create(req, res, next){
  const reservationDetails = req.body.data;
  const data =  await reservationsService.create(reservationDetails);
  // console.log('create:: ', data)
  if(data.status != "booked"){
    return next({
      status:400, 
      message:`status ${data.status} is wrongly populated`, 
    })
  }
  res.status(201).json({data});    
}

async function update(req, res, next){
  const reservationDetails = req.body.data;
  // console.log('update::', reservationDetails)//----------
  reservationsService.update(reservationDetails)
      .then((data)=> res.status(202).json({data}))
      .catch(next); 
}

async function updateReser(req, res, next){
  // const reservation_id = parseInt(req.params);
  const reservation = req.body.data;
  reservationsService.updateReser(reservation)
    .then((data)=> res.status(200).json({data}))
    // .then(console.log())
    .catch(next);
}

async function read(req, res, next){
  const {reservation_id} = req.params;
  // console.log('read:::: ', reservation_id, '  type::', typeof(reservation_id));
  const  response =  await reservationsService.read(parseInt(reservation_id));
  if (response) {
    return res.status(200).json({data: response});
    }
  
  return next({
    status:404,
    message:`reservation_id ${reservation_id} do not exists`,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create :[
    asyncErrorBoundary(requestHasData),
    asyncErrorBoundary(reqBodyHas("first_name")),
    asyncErrorBoundary(reqBodyHas("last_name")),
    asyncErrorBoundary(reqBodyHas("mobile_number")), 
    asyncErrorBoundary(reqBodyHas("reservation_date")), 
    asyncErrorBoundary(reqBodyHas("reservation_time")), 
    asyncErrorBoundary(reqBodyHas("people")),
    asyncErrorBoundary(isDateValid),
    asyncErrorBoundary(isTimeFormatValid),
    asyncErrorBoundary(dateInFuture),
    asyncErrorBoundary(dateIsRestaurantClosedDate),
    asyncErrorBoundary(timeWithInRestaurantHours),
    asyncErrorBoundary(isPhoneValid),
    asyncErrorBoundary(isPeopleNumber),
    asyncErrorBoundary(create),
  ], 
  update:[
    asyncErrorBoundary(requestHasData),
    asyncErrorBoundary(reqBodyHas("first_name")),
    asyncErrorBoundary(reqBodyHas("last_name")),
    asyncErrorBoundary(reqBodyHas("mobile_number")), 
    asyncErrorBoundary(reqBodyHas("reservation_date")), 
    asyncErrorBoundary(reqBodyHas("reservation_time")), 
    asyncErrorBoundary(reqBodyHas("people")),
    asyncErrorBoundary(isDateValid),
    asyncErrorBoundary(isTimeFormatValid),
    asyncErrorBoundary(dateInFuture),
    asyncErrorBoundary(dateIsRestaurantClosedDate),
    asyncErrorBoundary(timeWithInRestaurantHours),
    asyncErrorBoundary(isPhoneValid),
    asyncErrorBoundary(update),
  ],
  updateReser:[
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(requestHasData),
    asyncErrorBoundary(reqBodyHas("first_name")),
    asyncErrorBoundary(reqBodyHas("last_name")),
    asyncErrorBoundary(reqBodyHas("mobile_number")), 
    asyncErrorBoundary(reqBodyHas("reservation_date")), 
    asyncErrorBoundary(reqBodyHas("reservation_time")), 
    asyncErrorBoundary(reqBodyHas("people")),
    asyncErrorBoundary(isDateValid),
    asyncErrorBoundary(isTimeFormatValid),
    asyncErrorBoundary(dateInFuture),
    asyncErrorBoundary(dateIsRestaurantClosedDate),
    asyncErrorBoundary(timeWithInRestaurantHours),
    asyncErrorBoundary(isPhoneValid),
    asyncErrorBoundary(isNotFinishedStatus),
    asyncErrorBoundary(isPeopleNumber),
    asyncErrorBoundary(updateReser),
  ],
  updateStatus:[
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validStatus),
    asyncErrorBoundary(isNotFinishedStatus),
    asyncErrorBoundary(updateStatus),
  ],
    read : asyncErrorBoundary(read) 
};

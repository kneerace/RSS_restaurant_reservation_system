const knex = require("../db/connection");

function list(){
    return knex("reservations")
        .select("*");
}

function listByDate(reservation_date){
    return knex("reservations")
        .select("*")
        .where({reservation_date})
        .whereNot({status:"finished"})
        .whereNot({status: "cancelled"})
        .orderBy("reservation_time");
}

function listByMobileNumber(mobile_number){
    return knex("reservations")
        .select("*")
        .where({mobile_number})
        .whereNot({status:"finished"})
        .whereNot({status: "cancelled"})
        .orderBy("reservation_date", "reservation_time");
}
function read(name){
    return knex("reservations")
        .select("*")
        .where({name})
        .first();

}


function create(newReservation){
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then(returnedValue => returnedValue[0]);

}

module.exports = {list,
    listByDate,
    listByMobileNumber,
    read,
    create,
    };
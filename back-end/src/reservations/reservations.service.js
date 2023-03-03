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
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
          )
          .orderBy("reservation_date");
        // .where({mobile_number})
        // // .whereNot({status:"finished"})
        // // .whereNot({status: "cancelled"})
        // .orderBy("reservation_date", "reservation_time");
}

function read(reservation_id){
    return knex("reservations")
        .select("*")
        .where({reservation_id})
        .first();

}

function updateStatus(reservation_id,status){
    return knex("reservations")
        .where({reservation_id})
        .update({status}, "status")
        .then(data => data[0]);
}

function create(newReservation){
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then(returnedValue => returnedValue[0]);
}


function update(reservationDetails){
    return knex("reservations")
        .where({reservation_id : reservationDetails.reservation_id})
        .update({
            first_name: reservationDetails.first_name,
            last_name: reservationDetails.last_name,
            mobile_number: reservationDetails.mobile_number,
            reservation_date: reservationDetails.reservation_date,
            reservation_time: reservationDetails.reservation_time, 
            people: reservationDetails.people
        },"*");
}

function updateReser(reservation){
    return knex("reservations")
        .where({reservation_id:reservation.reservation_id})
        .update({
            first_name: reservation.first_name,
            last_name: reservation.last_name,
            mobile_number: reservation.mobile_number,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time, 
            people: reservation.people
        },"*")
        .then(data => data[0]);
    }


module.exports = {list,
    listByDate,
    listByMobileNumber,
    read,
    create,
    updateStatus,
    update,
    updateReser
    };
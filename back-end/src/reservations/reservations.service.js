const knex = require("../db/connection");

function list(){
    return knex("reservations")
        .select("*");
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
    read,
    create,
    };
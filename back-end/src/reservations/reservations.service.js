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


function insert(newReservation){
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then(returnedValue => returnedValue[0]);

}

module.exports = {list, 
    read,
    insert,
    };
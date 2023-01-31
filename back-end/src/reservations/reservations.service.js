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


function insert(){
    return knex("reservations")
        .insert

}

module.exports = {list, 
    read,
    insert,
    };
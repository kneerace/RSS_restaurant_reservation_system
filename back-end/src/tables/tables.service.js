const knex = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function list(){
    return knex("tables")
        .select("*")
        .orderBy("table_id");
}

function read(table_id){
    return knex("tables")
        .select("*")
        .where({table_id})
        .first();
}

function create(newTable){
    return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdTable)=> createdTable[0]);
}

function update(table_id){
    return knex("tables")
        .where ({table_id})
        .update({reservation_id:null})
        .returning("*");
}
module.exports = {
    list,
    create,
    read,
    update,
}
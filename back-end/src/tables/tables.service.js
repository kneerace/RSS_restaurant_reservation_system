const knex = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function list(){
    return knex("tables")
        .select("*")
        .orderBy("table_id");
}

function create(newTable){
    return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdTable)=> createdTable[0]);
}
module.exports = {
    list,
    create,
}
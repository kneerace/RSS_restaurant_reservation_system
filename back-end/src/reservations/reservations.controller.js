const reservationsService = require("./reservations.service");
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
      reservationsService.list()
      .then((data)=> res.json({data}))
      .catch(next);
}

module.exports = {
  list,
};

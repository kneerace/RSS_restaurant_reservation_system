import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, dateChange }) {

 
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  
  useEffect(loadDashboard, [date]);

    function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // console.log("AFTER loadDashboard():: ", reservations);

  const handleDateUpdate = ({ target }) => {
    // console.log("handleDateUpdate in Dashboard.js:: ", target.name , " date::: ", date);
    switch (target.name) {
      case "previous":
        dateChange(previous(date));
        break;
      case "today":
        dateChange(today());
        break;
      case "next":
        dateChange(next(date));
        break;
      default:
        dateChange(today())
        break;
    }
    // console.log("handleDateUpdate in Dashboard.js after switch:: ", target.name , " date::: ", date)
  };


  return (
    <main>
      
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="d-inline-block">Dashboard</h1>
          <h4 className="mb-0">Reservations for {date}</h4>
          <span className="text-right">
            {reservations.length >= 1 ? (
              <span className="mx-3">
                <span className="reservation-count">{reservations.length}</span>
                &nbsp;reservations
              </span>
            ) : (
              // <div className="mx-3 text-center mt-4">No reservations</div>
              <span> No reservations </span>
            )}
          </span>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <div className="col-md-2 col-sm-3 col-xs-12 col">
          <button
            name="previous"
            className="btn btn-secondary btn-sm btn-block"
            onClick={handleDateUpdate}
            >
            Previous
          </button>
        </div>

        <div className="col-md-2 col-sm-3 col-xs-12 col">
          <button
            name="today"
            className="btn btn-primary btn-sm btn-block"
            onClick={handleDateUpdate}
            >
            Today
          </button>
        </div>

        <div className="col-md-2 col-sm-3 col-xs-12 col">
          <button
            name="next"
            className="btn btn-secondary btn-sm btn-block"
            onClick={handleDateUpdate}
            >
            Next
          </button>
        </div>
      </div>

      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}


    </main>
  );
}

export default Dashboard;

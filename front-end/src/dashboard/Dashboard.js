import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import RenderReservations from "../reservations/RenderReservations";
import RenderTables from "../tables/RenderTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, errorHandler }) {
  
  const history = useHistory();
 
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  
  const [tables, setTables]= useState([]);
  const[ tableError, setTablesError]= useState(null);
  
      // //Fetching reservation
    useEffect(()=>{
        async function loadDashboard() {
          const abortController = new AbortController();
            try{
                setReservationsError(null);
                const response = await listReservations({ date }, abortController.signal);            
                 setReservations(response);
            }
            catch(error){
                // console.log('Error: ', error); //-------TODO 
                setReservationsError(error);
                ErrorAlert(reservationsError);
            }
                }
                loadDashboard();
    }, [date]);

    //fetching tables list
    useEffect(()=>{
      async function loadTables() {
        const abortController = new AbortController();
          try{
              setTablesError(null);
              const response = await listTables( abortController.signal);            
               setTables(response);
          }
          catch(error){
              // console.log('Error: ', error); //-------TODO 
              setTablesError(error);
              ErrorAlert(tableError);
          }
              }
              loadTables();
  }, [reservations]);


  const handleDateUpdate = ({ target }) => {
    switch (target.name) {
      case "previous":
        // dateChange(previous(date));
        history.push(`/dashboard?date=${previous(date)}`);
        break;
      case "today":
        // dateChange(today());
        history.push(`/dashboard?date=${today()}`);
        break;
      case "next":
        // dateChange(next(date));
        history.push(`/dashboard?date=${next(date)}`);
        break;
      default:
        history.push(`/dashboard?date=${today()}`);
        break;
    }
  };

  return (
    <main>
      
      <div className="row row-no-gutters">
        <div className="col-12 text-center">
          <h1 className="d-inline-block">Dashboard</h1>
          <h4 className="mb-0">Reservations for {date}</h4>
          <span className="text-right">
            {reservations.length >= 1 ? (
              <span className="mx-3">
                <span className="reservation-count">{reservations.length}</span>
                &nbsp;
                {reservations.length >1 ? <span>reservations</span>:
                <span>reservation</span> }
                
              </span>
            ) : (
              // <div className="mx-3 text-center mt-4">No reservations</div>
              <span> No reservations </span>
            )}
          </span>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3">
        {/* <div className = "row row-no-gutters justify-content-center" > */}
        <div className="col-md-2 col-sm-3 col-xs-12 col">
          <button
            name="previous"
            className="btn btn-secondary btn-sm btn-block"
            onClick={handleDateUpdate}
            >{String.fromCharCode(8592)}&nbsp;
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
            className="btn btn-secondary btn-sm btn-block "
            onClick={handleDateUpdate}
            > 
            Next&nbsp;{String.fromCharCode(8594)}
          </button>
        </div>
      </div>
      < RenderTables tables={tables} errorHandler={errorHandler} />
      {/* <ErrorAlert error={reservationsError} /> */}
      <RenderReservations reservations={reservations} errorHandler = {errorHandler} />
      {/* {JSON.stringify(reservations)} */}
      {/* {reservations} */}


    </main>
  );
}

export default Dashboard;

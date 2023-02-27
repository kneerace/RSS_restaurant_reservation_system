import React from "react";
import {Link, useHistory} from "react-router-dom";
import {updateStatus} from "../utils/api";


function RenderReservations({reservations,errorHandler}){
    // console.log("RenderReservations: ", reservations);
    const history = useHistory();
    // Mapping each deck from the response
    const reservationList = reservations.map((reservation)=>{
        const {
            reservation_id,
            first_name,
            last_name,
            mobile_number,
            people,
            status,
            reservation_time,
          } = reservation;
    
    const handleCancel = async (event)=>{
        event.preventDefault();
            if(window.confirm(`Are you sure to cancel this Reservation? \nOnce cancelled it can't be recovered.\nWe need to fill details for new Reservation again`))
                {
                try{
                    const abortController = new AbortController();
                    await updateStatus(
                            reservation_id, "cancelled", abortController.abort()
                            );
                        history.go(0);
                    } catch(error){
                        // console.log(error);
                        error && errorHandler(error);
                    }
                }
        };

        return(
            <div className="col-sm-5" key={reservation.id}>
                <div className="card col-md-8 shadow m-3 p-0 reservation-card">
                    <h5 className="card-header">{first_name}&nbsp;{last_name}</h5>
                    
                    <div className="card-body">
                        <div className="row">
                            <div className="col-4">Phone:</div>
                                <span>{mobile_number}</span>
                        </div>
                        <div className="row">
                            <div className="col-4">Time:</div>
                                <span>{reservation_time}</span>
                        </div>
                        <div className="row">
                            <div className="col-4">Guests:</div>
                                <span>{people}</span>
                        </div>
                        <div className="row">
                            <div className="col-4">Status:</div>
                                <span  
                                data-reservation-id-status={reservation.reservation_id}>{status}</span>
                        </div>
                        <div className="row my-3 d-flex justify-content-center mx-3">
                            <div className="col-4 px-2">
                               { status == "booked" && <Link to={`/reservations/${reservation_id}/seat`}
                                className={`card-button btn btn-secondary {"disabled": ${status}!="booked"}`} id="reservation-id">Seat</Link>}
                            </div>
                            <div className="col-4 px-2">
                                <Link to={`reservations/${reservation_id}`} className=' card-button btn btn-outline-primary ml-1'>Edit</Link>
                            </div>
                            <div className="col-4 px=2">
                                <button className='card-button btn btn-danger' onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    });
   
   return(
    <div className="row">
        {reservationList}
    </div>
   );
}

export default RenderReservations;
import React, { useState, useEffect} from "react";
import {useHistory, useLocation, useParams} from "react-router-dom";
import { createReservation,updateReservation } from "../utils/api";

function ReservationForm({errorHandler}){
  // errorHandler(null);
  const history = useHistory();
  const {pathname, state} = useLocation();

  const today = new Date().toISOString().split("T")[0];
  const initialReservation = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 1,
    reservation_date: "",
    reservation_time: "",
  }
  const [reservation, setReservation] = useState(initialReservation);
  const[editFlag, setEditFlag] = useState(false);

  //show initial form data
  useEffect(()=>{
    function newReservation(){
      if(pathname.includes("new")){
          setReservation(initialReservation);
      }
      else if (pathname.includes("edit")){
          setReservation(state.reservation);
          setEditFlag(true);
      }
    }
    newReservation();
    },[pathname]);
    
    // record of change on filling form values
    function handleChange({target}){
      if(target.name === "people"){
        setReservation({...reservation, [target.name]:Number(target.value)});
      }
      else {
        setReservation({...reservation, [target.name]: target.value});
      }
    };

    // effect based on SUBMIT button click
    async function handleSubmit(event){
      event.preventDefault();
      try{
        const abortController = new AbortController();
        if(editFlag){
          await updateReservation(reservation, abortController.abort());
          history.goBack();
        }
        else{        
        const response = await createReservation(reservation, abortController.abort());
        setReservation(response);
        history.push(`/dashboard?date=${reservation.reservation_date}`);
        }

        errorHandler(null);  
      } catch(error){
        error && errorHandler(error);
        // console.log("handleSubmit error ", error)
      }
    }

    // effect based on CANCEL button click
    function handleCancel(){
      // event.preventDefault();
      history.goBack();
    }

    return (
        <div>
          <div className="row">
                <div className="col-12 text-center">
                  {editFlag ? <h1>Edit Reservation</h1> : <h1>New Reservation</h1>}
                </div>
          </div>
    <form onSubmit={handleSubmit}>
        <div className="row d-flex justify-content-center">
            <div className="col-md-4 col-lg-4 mb-3">
                <label htmlFor="first_name" className="form-label">
                    First Name
                </label>
                <input type="text" 
                    name="first_name" 
                    id="first_name"
                    placeholder="First Name"
                    classname="form-control" 
                    onChange={handleChange} 
                    value={reservation.first_name}
                    required
                />
            </div>

            <div className="col-md-4 col-lg-4 mb-3">
                <label htmlFor="last_name" className="form-label">
                    Last Name
                </label>
                <input type="text" 
                    name="last_name" 
                    id="last_name"
                    placeholder="Last Name"
                    classname="form-control" 
                    onChange={handleChange} 
                    value={reservation.last_name}required
                />
            </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-md-4 col-lg-4 mb-3">
            <label htmlFor="mobile_number" className="form-label">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile_number"
              id="mobile_number"
              placeholder="(571)-456-7890"
              className="form-control" 
              onChange={handleChange} 
              value={reservation.mobile_number} required
            />
          </div>
          <div className="col-md-4 col-lg-4 mb-3">
            <label htmlFor="people" className="form-label">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              max="100"
              name="people"
              id="people"
              placeholder="1"
              className="form-control" 
              onChange={handleChange} value={reservation.people}  required
            />
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-md-4 col-lg-4 mb-3">
            <label htmlFor="reservation_date" className="form-label">
              Reservation Date
            </label>
            <input
              type="date"
              name="reservation_date"
              id="reservation_date"
              placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}"
              className="form-control" 
              onChange={handleChange} 
              value={reservation.reservation_date} required
            />
          </div>
          <div className="col-md-4 col-lg-4 mb-3">
            <label htmlFor="reservation_time" className="form-label">
              Reservation Time
            </label>
            <input
              type="time"
              name="reservation_time"
              id="reservation_time"
              placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}"
              className="form-control" 
              onChange={handleChange} 
              value={reservation.reservation_time} required
            />
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-lg-2 col-md-2  col-sm col-6 col">
            <button type="submit" className="btn btn-primary form-control">
                Submit
            </button>
          </div>
          <div className="col-lg-2 col-md-2  col-sm col-6 col">
            <button type="button" className="btn btn-secondary form-control"
            onClick={()=> handleCancel()}>
                Cancel
            </button>
          </div>
        </div>
        

    </form>
    </div>
    );
}

export default ReservationForm;
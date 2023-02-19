import React, { useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import { createReservation } from "../utils/api";

function ReservationForm(){
  const history = useHistory();
  const {pathname} = useLocation();

  const today = new Date().toISOString().split("T")[0];
  const initialReservation = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 1,
    reservation_date: today,
    reservation_time: "10:30",
  }
  const [reservation, setReservation] = useState(initialReservation);
  //show initial form data
  useEffect(()=>{
    function newReservation(){
      if(pathname.includes("new")){
          setReservation(initialReservation);
      }
      // else{
          // setEditFlag(false);
      // }
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
        await createReservation(reservation, abortController.abort());
        history.push("/"); // for now pusing to dashboard
      } catch(error){
        console.log("handleSubmit error ", error)
      }
    }

    // effect based on CANCEL button click
    function handleCancel(event){
      event.preventDefault();
      history.goBack();
    }

    return (
        <div>
    <h1>New Reservation</h1>

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
                    onChange={handleChange} required
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
                    onChange={handleChange} required
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
              onChange={handleChange} required
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
              onChange={handleChange} required
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
              onChange={handleChange} required
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
              onChange={handleChange} required
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
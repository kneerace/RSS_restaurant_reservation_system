import React, {useState} from "react";
import { listReservations } from "../utils/api";
import RenderReservations from "../reservations/RenderReservations";

function SearchForm(){
    
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [noReservation, setNoReservation] = useState(false);

    async function handleChange({target}){
        setMobileNumber(target.value);
        // console.log('SearchForm handleChange:::', mobileNumber)
    }

    async function handleSearch(event){
        setReservations([]);
        setNoReservation(false);
        event.preventDefault();
        const abortController = new AbortController();
        setReservationsError(null);
        
        listReservations({mobile_number: mobileNumber}, abortController.signal)
        .then(response=> {
            response.length>0 ? setReservations(response) : setNoReservation(true);
            // console.log('response length:::', response.length, '  noReservation:::', noReservation);
        })
        .catch(reservationsError);
    }

    return(
        <div>
            <div className="row">
                <div className="col-12 text-center">
                    <h1>Search</h1>
                </div>
            </div>
            <div className="row ">
                <div className="col text-center">Search by Mobile Number
                </div>
            </div>
            <div className="row">
                <div className="col text-center">
                <div className="row d-flex justify-content-center">
                    <form onSubmit={handleSearch} className="form-inline mt-2">
                        <input
                            type="tel"
                            name="mobile_number"
                            id="mobile_number"
                            placeholder="Enter a customer's phone number"
                            className="form-control" 
                            value ={mobileNumber}
                            onChange={handleChange} required
                        /> 
                    <button type="submit" className="btn-md btn-primary form-control mx-2"
                     >
                        Find   </button>
                    </form>
                    
                    <div className="col-12">
                        <RenderReservations reservations={reservations} />
                        {noReservation && (<div>No reservations found</div>)}
                    </div>
                </div>
                </div>
            </div>   
            
        </div>
    )

};


export default SearchForm;
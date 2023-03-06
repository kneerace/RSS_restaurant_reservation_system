import React, {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables,updateTableReservation } from "../utils/api";


function AssignSeatToReservation({errorHandler}){
    const history = useHistory();

    const {reservation_id} = useParams();

    const [tables, setTables]= useState([]);

      // setting initial form data
      const intialFormData = {
        table_id:""
        , reservation_id : reservation_id
    } ;
    
    const [seat, setSeat] = useState({...intialFormData});

    //fetching tables list
    useEffect(()=>{
        async function loadTables() {
          const abortController = new AbortController();
            try{
                const response = await listTables( abortController.signal);            
                 setTables(response);
            }
            catch(error){
                error && errorHandler(error);
            }
                }
                loadTables();
    }, []);
  
    // Handling Change in form input 
    function handleChange({target}){
          setSeat({...seat, table_id: target.value});
      };

    //   console.log('setSeat::: ', seat)

    async function handleSubmit(event){
        event.preventDefault();
        try{
            const abortController = new AbortController();
            await updateTableReservation(seat.table_id, seat.reservation_id, abortController.abort())
            history.push(`/dashboard`);
            errorHandler(null);  
        } catch(error){
            error && errorHandler(error);
        }
    };

    const handleCancel = (event)=>{
        event.preventDefault();
        history.goBack();
    }

    return(
        <div>
            <div className="row">
                <div className="col text-center">
                    <h1>Reservation Seat Assignment</h1>
                </div>
            </div>
            
            <div className="row">
                <div></div>
            </div>

            <form onSubmit={(event) => handleSubmit(event)}>
                <div className="row">
                <div className="col text-center">Assigning table for Reservation: {reservation_id}</div>
                    <div className="col text-center">Table Name - Table Capacity</div>
                </div>
                
                <div className="row justify-content-md my-2 col-md-offset-4">
                     <div className="col-md-4 col-lg-4 text-center my-2 ">
                        <label >Table Number:</label>
                    </div>
                    <div className="col-md-4 col-lg-4 mb-3 text-center">
                        <select
                           className="form-control custom-select selectpicker show-tick"
                           name="table_id"
                            onChange={handleChange} 
                            required >
                           <option value="">Select a Table:</option>
                            {tables.map((table)=>(
                            <option key={table.table_id} value={table.table_id}>
                                {`${table.table_name} - ${table.capacity}`}
                            </option>
                           ))}
                         </select>
                    </div>
                </div>
                <div className="row justify-content-md-center my-2">
                    <div className="col-md-2 col-sm col-6">
                        <button type="submit" className="btn btn-primary form-control"
                        >Submit</button>
                    </div>
                    <div className="col-md-2 col-sm col-6">
                        <button type="button" className="btn btn-secondary form-control"
                        onClick={handleCancel}
                        >Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AssignSeatToReservation;
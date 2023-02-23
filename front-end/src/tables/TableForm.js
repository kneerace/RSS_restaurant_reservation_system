import React, { useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import { createTable } from "../utils/api";
{/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> */}

function TableForm({errorHandler}){

    const history = useHistory();

    const initialTableForm = {
        table_name: "",
        capacity:"",
    }

    const [table, setTable]= useState(initialTableForm);

    // record of change on filling form values
    function handleChange({target}){
        if(target.name === "people"){
          setTable({...table, [target.name]:Number(target.value)});
        }
        else {
          setTable({...table, [target.name]: target.value});
        }
      };

    // effect based on SUBMIT button click
    async function handleSubmit(event){
        event.preventDefault();
        try{
        const abortController = new AbortController();
        const response = await createTable(table, abortController.abort());
        setTable(response);
        
        history.push(`/dashboard`);
        errorHandler(null);  
        } catch(error){
        error && errorHandler(error);
        console.log("handleSubmit error ", error)
        }
    }

    // effect based on CANCEL button click
    function handleCancel(event){
        // console.log('handleCancel:::', event)
        event.preventDefault();
        history.goBack();
    }

return (
        <div>
            <div className="row">
                <div className="col-12 text-center">
                    <h1>New Table</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row d-flex justify-content-center">
                    
                    <div className="col-md-4 col-lg-4 mb-3">
                        <label htmlFor="table_name" className="form-label">
                            Table Name
                        </label>
                        <input type="text" name="table_name" id="table_name"
                            placeholder="Table Name" min="2" className="form-control"
                            onChange={handleChange} required
                        />
                    </div>
                    <div className="col-md-4 col-lg-4 mb-3">
                        <label htmlFor="capacity" className="form-label">
                            Capacity
                        </label>
                        <input type="text" name="capacity" id="capacity"
                            placeholder="Capacity" min="1" className="form-control"
                            onChange={handleChange} required
                        />
                    </div>
                </div>
                
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-2 col-md-2  col-sm col-6 col">
                        <button type="submit" className="btn btn-primary form-control">
                            Submit </button>
                    </div>
                    <div className="col-lg-2 col-md-2  col-sm col-6 col">
                        <button type="button" className="btn btn-secondary form-control"
                        onClick={handleCancel}>
                         Cancel </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TableForm;
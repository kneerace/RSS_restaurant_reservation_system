import React from "react";
import {Link, useHistory} from "react-router-dom";
import {updateStatus, resetTable} from "../utils/api";
import TableView from "./TableView";


function RenderTables({tables,errorHandler}){
    console.log("RenderTables: ", tables);
    const history = useHistory();
  
    const finishTable = async (table)=> {
        if(window.confirm(`Is the table ready to seat new Guests?\n This cannont be Undone!!`)){
            try{
                const abortController = new AbortController();
                await updateStatus(table.reservation_id, "finished", abortController.signal);
                await resetTable(table.table_id, abortController.signal);
                errorHandler(null);
                history.go();
            } catch(error){
                error && errorHandler(error);
            }
        }
    };
         
          return (
            <div className="container-fluid mt-3 shadow table-list-bg">
                <div className="row" >
                    <div className="tables-caption"> 
                        <div className="text-center font-weight-bold">Tables</div>
                    </div>
                </div>
                
                <div className="row ">
                    <div className="col-3 tables-header">Table/Bar </div>
                    <div className="col-3 tables-header">Capacity </div>
                    <div className="col tables-header">Status </div>
                </div>
                
                <div className="row">
                    <div className="d-flex flex-column w-100">
                    { tables.map((table,index)=>(
                            <TableView finishTable={()=> finishTable(table)}  table={table} />
                        ))
                    }
                    </div>
                </div>
            </div>
          );
}

export default RenderTables;
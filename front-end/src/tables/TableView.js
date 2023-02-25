import React from "react";

function TableView({table, finishTable}){
    // console.log("postview ",post);
    return(
        
        // <tr>
        //     <td>{table.table_name}</td>
        //     <td>{table.capacity}</td>
        //     <td>{table.reservation_id? "Occupied" :"Free"}</td>
        //     <td>
        //         {table.reservation_id && <button className="btn btn-outline-danger btn-sm" 
        //             data-table-id-finish={table.table_id}
        //             onClick={finishTable}
        //         >
        //             Finish</button> }
        //     </td>
        // </tr>
        <div
        className={
          table.reservation_id
            ? "row p-0 m-0 py-1 table-occupied d-flex align-items-center"
            : "row p-0 m-0 py-1 table-item"
        }
        key={table.table_id}
      >
        <div className="col-3">{table.table_name}:</div>
        <div className="col-3">{table.capacity}</div>
        <div className="col " data-table-id-status={`${table.table_id}`}>
          {table.reservation_id ? (
            <span className="tbl-occupied">Occupied</span>
          ) : (
            <span className="tbl-free my-5">Free</span>
          )}
        </div>
        {table.reservation_id && (
          <div className="col-3">
            <button
              className="btn btn-outline-danger btn-sm"
              data-table-id-finish={table.table_id}
              onClick={() => finishTable(table)}
            >
              Finish
            </button>
          </div>
        )}
      </div>

    )
}

export default TableView;
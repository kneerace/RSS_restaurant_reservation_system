import React,{useState, useEffect} from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  const [ showError, setShowError]= useState("hide");

  console.log(' CheckError ', error)
  useEffect (()=>{
    if(error){
      setShowError("show");
    }
    else { setShowError("hide");
  }
  },[error]);

   function handleShowError(){
      setShowError("hide")
    // console.log("handleShowError:::: ", showError )
  }

  // console.log("out of handleShowError:::: ", showError )

  return (
    error && (
      
      <div className={`alert alert-danger m-2 alert-dismissible fade ${showError}`} role="alert">
        <strong>Error: </strong>{error.message}
        {showError === "show" ? (
        <button type="button" className="close" aria-label="Close" onClick={handleShowError}>
          <span aria-hidden="true">&times;</span>
        </button>
          ): null}
      </div>
      )
    )
  }
  

export default ErrorAlert;

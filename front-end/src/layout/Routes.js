import React, {useState, useEffect} from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationForm from "../reservations/ReservationsForm";
import TableForm from "../tables/TableForm";
import useQuery from "../utils/useQuery";


/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes({errorHandler}) {

  const [date, setDate ] = useState(today());
  // const dateChange = (newDate) => setDate(newDate);

  const query = useQuery().get("date");

  useEffect(()=>{
    query && setDate((currentDate)=> query);
  }, [query] );

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} errorHandler={errorHandler} />
      </Route>

      <Route path="/search">
        <h1> Search page</h1>
      </Route>
      <Route path="/reservations/new">
        <ReservationForm errorHandler={errorHandler}/>
      </Route>
      <Route path="/tables/new">
        <TableForm errorHandler={errorHandler} />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

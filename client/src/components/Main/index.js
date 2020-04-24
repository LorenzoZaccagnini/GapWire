import React from "react";
import {
  Link
} from 'react-router-dom';
export default class App extends React.Component {
  state = {
    total: null,
    next: null,
    operation: null,
  };


  render() {
    return (
      <div className="container mt-5" align="center">
        <h1> Druwire </h1>
          <div className="mx-auto">
            Created from fork of Darkwire, it's an anonymous and open source chat where you can get help from qualified professionals
          </div>
          <button type="button" class="btn btn-primary btn-lg mt-5">Join a Room</button>
          <div className="mt-5">
             <Link to="/r">
             Login for authorized personnel
             </Link>
          </div>
      </div>
    );
  }
}

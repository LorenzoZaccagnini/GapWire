import React, { Component } from "react";
import {withRouter} from 'react-router';

import {
  Link
} from 'react-router-dom';
class Main extends Component {
  constructor(props) {
    super(props)
    this.searchAndJoin = this.searchAndJoin.bind(this);

  }

  searchAndJoin() {
    fetch("http://localhost:3001/active")
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length) {
          console.log(data);
          const randRoom = data[Math.floor(Math.random() * data.length)];
          console.log(randRoom);
          this.props.history.push('/r/' + randRoom);
        }
      }
    );
  }


  render() {
    return (
      <div className="container mt-5" align="center">
        <h1 className="pt-5"> Druwire </h1>
          <div className="mx-auto">
            Created from fork of Darkwire, it's an anonymous and open source chat where you can get help from qualified professionals
          </div>
          <button type="button"
          class="btn btn-primary btn-lg mt-5"
          onClick={() => this.searchAndJoin()}
          >Join a Room</button>
        <div className="pt-5">
             <Link to="/login">
               Login for authorized personnel
             </Link>
          </div>
      </div>
    );
  }
}

export default Main;

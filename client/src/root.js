import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-simple-dropdown/styles/Dropdown.css'
import 'stylesheets/app.sass'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from 'store'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import shortId from 'shortid'
import Home from 'components/Home'
import Login from 'components/Login'
import Main from 'components/Main'
import { hasTouchSupport } from './utils/dom'

const store = configureStore()

export default class Root extends Component {
  componentWillMount() {
    if (hasTouchSupport) {
      document.body.classList.add('touch')
    }
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="h-100">
            <Switch>
              <Route exact path="/" component={Main}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/r" render={() => <Redirect to={`/r/${shortId.generate()}`} />} />
              <Route path="/r/:roomId" component={Home} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
}

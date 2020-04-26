import React, { Component } from 'react'
import PropTypes from 'prop-types'
import RoomLink from 'components/RoomLink'

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomUrl: `https://darkwire.io/${props.roomId}`,
    }
  }

  render() {
    return (
      <div>
        <div>
          Druwire is a fork of Darkwire:
          <ul className="native">
            <li>Only authorized users can create a Room</li>
            <li>Slash commands (/nick, /me, /clear)</li>
            <li>Rooms have a limit of 2 people</li>
            <li>We use AES-GCM and SHA256</li>
            <li>Send files up to 4 MB</li>
          </ul>
          <div>
            You can learn more <a href="https://github.com/LorenzoZaccagnini/druwire" target="_blank" rel="noopener noreferrer">here</a>.
          </div>
        </div>
        <br />
        <div className="react-modal-footer">
          <button className="btn btn-primary btn-lg" onClick={this.props.close}>{this.props.translations.welcomeModalCTA}</button>
        </div>
      </div>
    )
  }
}

Welcome.propTypes = {
  roomId: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  translations: PropTypes.object.isRequired,
}

export default Welcome

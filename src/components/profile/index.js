import { h, Component } from 'preact'
import style from './style.css'
import PropTypes from 'prop-types'

export default class Profile extends Component {
  state = {
    count: 0
  }

  propTypes = {
    index: PropTypes.number
  }

  // update the current time
  updateTime = () => {
    let time = new Date().toLocaleString()
    this.setState({ time })
  };

  // gets called when this route is navigated to
  componentDidMount () {
    // start a timer for the clock:
    this.timer = setInterval(this.updateTime, 1000)
    this.updateTime()

    // every time we get remounted, increment a counter:
    this.setState({ count: this.state.count + 1 })
  }

  // gets called just before navigating away from the route
  componentWillUnmount () {
    clearInterval(this.timer)
  }

  // Note: `user` comes from the URL, courtesy of our router
  render ({ user }, { time, count }) {
    return (
      <div className={style.profile}>
        <h1>Profile: {user}</h1>
        <p>This is the user profile for a user named {user}.</p>

        <div>Current time: {time}</div>
        <div>Profile route mounted {count} times.</div>
        <div>Index: {this.props.index ? this.props.index : 0}</div>
      </div>
    )
  }
}
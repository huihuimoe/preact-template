import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
import Home from './home'
import Profile from './profile'

import style from './app.css'

export default class App extends Component {
  componentDidMount () {
    const loading = document.querySelector('.loading')
    loading.style.opacity = 0
    setTimeout(() => loading.remove(), 500)
  }

  /** Gets fired when the route changes.
   *  @param {Object} event    "change" event from [preact-router](http://git.io/preact-router)
   *  @param {string} event.url  The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url
  }

  render () {
    return (
      <div className={style.app}>
        <Header />
        <Router onChange={this.handleRoute}>
          <Home path='/' />
          <Profile path='/profile/' user='me' index={3} />
          <Profile path='/profile/:user' />
        </Router>
      </div>
    )
  }
}

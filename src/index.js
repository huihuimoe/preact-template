import { h, render } from 'preact'
import App from './components/app'

let root
function init () {
  root = render(<App />, document.body, root)
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

// in development, set up HMR:
if (module.hot) {
  require('preact/devtools') // turn this on if you want to enable React DevTools!
  module.hot.accept('./components/app', init)
}

init()

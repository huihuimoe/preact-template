import { h, Component } from 'preact'
import { Link } from 'preact-router'
import style from './style.css'

export default class Header extends Component {
  render () {
    return (
      <header className={style.header}>
        <h1>Preact App</h1>
        <nav>
          <Link href='/'>Home</Link>
          <Link href='/profile'>Me</Link>
          <Link href='/profile/john'>John</Link>
        </nav>
      </header>
    )
  }
}
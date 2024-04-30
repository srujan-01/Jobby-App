import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const {history} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const onClickHomeLogo = () => {
    history.replace('/')
  }

  return (
    <>
      <nav className="navbar">
        <button className="logo-button" onClick={onClickHomeLogo}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </button>
        <ul className="list-container">
          <Link to="/">
            <li className="list-item">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="list-item">Jobs</li>
          </Link>
        </ul>
        <ul>
        <li>
        <button onClick={onClickLogout} type="button" className="button">
          Logout
        </button>
        </li>
        </ul>
      </nav>
    </>
  )
}

export default withRouter(Header)

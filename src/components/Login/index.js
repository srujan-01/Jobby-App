import {Redirect} from 'react-router-dom'

import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', isErrorShown: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  submitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({errorMsg, isErrorShown: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, isErrorShown} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <form className="card" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="logo"
            alt="website logo"
          />
          <div className="input-container">
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              placeholder="Username"
              id="username"
              onChange={this.onChangeUsername}
              className="input"
            />
          </div>
          <div className="input-container">
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              placeholder="Password"
              id="password"
              onChange={this.onChangePassword}
              className="input"
            />

            <button type="submit" className="button">
              Submit
            </button>
            {isErrorShown && <p className="error">{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}

export default Login

import {FaStar, FaSearch} from 'react-icons/fa'
import {MdWork} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import {GrLocation} from 'react-icons/gr'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusValues = {
  initial: 'INITIAL',
  inProgress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsData: [],
    profileApiStatus: apiStatusValues.initial,
    jobsApiStatus: apiStatusValues.initial,
    employmentType: [],
    minimuSalary: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusValues.inProgress})
    const {employmentType, minimuSalary, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${minimuSalary}&search=${searchInput}`

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const {jobs} = data
      const updatedData = jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      console.log(data)
      this.setState({
        jobsApiStatus: apiStatusValues.success,
        jobsData: updatedData,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusValues.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusValues.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusValues.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusValues.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }
  onChangeSalary = event => {
    const {minimuSalary} = this.state
    this.setState({minimuSalary: event.target.value}, this.getJobs)
    console.log(minimuSalary)
  }
  onClickSearch = () => {
    this.getJobs()
  }
  onChangeType = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.value],
        }),
        this.getJobs,
      )
    } else {
      console.log('Done')
    }
  }

  renderProfile = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <>
        <div className="profile-card">
          <img src={profileImageUrl} alt="profile" className="profile-image" />
          <h1 className="name">{name}</h1>
          <p className="description">{shortBio}</p>
        </div>
      </>
    )
  }

  renderProfieFailure = () => {
    return (
      <div className="failure">
        <button className="failure-button">Retry</button>
      </div>
    )
  }

  renderJobsFailure = () => {
    return (
      <div className="failure-card">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-view"
        />

        <h1 className="failure-heading">Oops! Something Went Wrong</h1>

        <p className="failure-description">
          We cannot seem to find the page you are looking for
        </p>

        <button className="failure-button">Retry</button>
      </div>
    )
  }

  renderLoader = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  renderGetJobs = () => {
    const {jobsData, searchInput} = this.state
    if (jobsData.length === 0) {
      return (
        <>
          <div className="jobs-not-found">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-jobs-image"
            />
            <h1 className="no-jobs-heading">No Jobs Found</h1>
            <p className="no-jobs-para">
              We could not find any jobs. try other filters
            </p>
          </div>
        </>
      )
    }

    return (
      <>
        <ul className="job-list-container">
          {jobsData.map(eachItem => (
            <li className="job-list-item" key={eachItem.id}>
              <Link to={`/jobs/${eachItem.id}`} className="item-link">
                <div className="logo-role">
                  <img
                    src={eachItem.companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div className="role-card">
                    <h1 className="role">{eachItem.title}</h1>
                    <div className="rating-star">
                      <FaStar className="star-icon" />
                      <p className="rating">{eachItem.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="place-salary">
                  <div className="location-job">
                    <div className="location-card">
                      <GrLocation className="icon" />
                      <p className="location">{eachItem.location}</p>
                    </div>
                    <div className="location-card second">
                      <MdWork className="icon" />
                      <p className="location">{eachItem.employmentType}</p>
                    </div>
                  </div>
                  <p className="salary">{eachItem.packagePerAnnum}</p>
                </div>
                <hr />
                <h1 className="description-heading">Description</h1>
                <p className="job-description">{eachItem.jobDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderProfileResults = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusValues.inProgress:
        return this.renderLoader()
      case apiStatusValues.success:
        return this.renderProfile()
      case apiStatusValues.failure:
        return this.renderProfieFailure()
      default:
        return null
    }
  }

  renderJobResults = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusValues.inProgress:
        return this.renderLoader()
      case apiStatusValues.success:
        return this.renderGetJobs()
      case apiStatusValues.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  renderResutls = () => {
    const {profileDetails, jobsData, searchInput} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    console.log(jobsData)

    return (
      <>
        <div className="filters">
          {this.renderProfileResults()}
          <hr />
          <p className="heading-1">Types of Employment</p>
          <ul className="employee-list-container">
            {employmentTypesList.map(eachItem => (
              <li
                className="employee-list-item"
                key={eachItem.employmentTypeId}
              >
                <input
                  type="checkbox"
                  id={eachItem.employmentTypeId}
                  className="checkbox"
                  value={eachItem.employmentTypeId}
                  onClick={this.onChangeType}
                />
                <label className="label" htmlFor={eachItem.employmentTypeId}>
                  {eachItem.label}
                </label>
              </li>
            ))}
          </ul>
          <hr />
          <p className="heading-1">Salary Range</p>
          <ul className="employee-list-container">
            {salaryRangesList.map(eachItem => (
              <li className="employee-list-item" key={eachItem.salaryRangeId}>
                <input
                  type="radio"
                  id={eachItem.salaryRangeId}
                  name="salary"
                  className="radio"
                  value={eachItem.salaryRangeId}
                  onChange={this.onChangeSalary}
                />
                <label className="label" htmlFor={eachItem.salaryRangeId}>
                  {eachItem.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="search-container">
            <input
              type="search"
              className="search"
              id="search"
              value={searchInput}
              placeholder="Search"
              onChange={this.onChangeSearchInput}
            />
            <label htmlFor="search">
              <button
                type="search"
                className="search-button"
                onClick={this.onClickSearch}
                data-testid="searchButton"
              >
                <FaSearch className="search-icon" />
              </button>
            </label>
          </div>
          <div>{this.renderJobResults()}</div>
        </div>
      </>
    )
  }

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-container">{this.renderResutls()}</div>
      </div>
    )
  }
}

export default Jobs

import {Component} from 'react'
import {FaStar, FaSearch} from 'react-icons/fa'
import {MdWork} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import {GrLocation} from 'react-icons/gr'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const apiStatusValues = {
  initial: 'INITIAL',
  inProgress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemData: {},
    apiStatus: apiStatusValues.initial,
    similarJobs: [],
    skillsList: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusValues.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = {
        jobDetails: data.job_details,
      }
      const similarJobsData = data.similar_jobs
      const {jobDetails} = updatedData
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employementType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        })),
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }
      this.setState({
        jobItemData: updatedJobDetails,
        similarJobs: similarJobsData,
        apiStatus: apiStatusValues.success,
      },this.getJobItemDetails)
    } else {
      this.setState({apiStatus: apiStatusValues.failure})
    }
  }
  onClickRetry = () => {
    this.getJobItemDetails()
  }
  renderSkills = async() => {
    const {jobItemData}=this.state 
    const {skills}= jobItemData
    return (
      <div className="skills-container">
        <h1 className="skills-heading">Skills</h1>
        <ul className="skills">
          {skills?skills.map(eachItem => (
            <li className="skill-list-item" key={eachItem.name}>
              <img src={eachItem.imageUrl} className="skill-image" />
            </li>
          )):null}
        </ul>
      </div>
    )
  }

  renderFailure = () => {
    return (
      <div className="failure-card">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-view"
        />

        <h1 className="failure-heading">Oops! Something Went Wrong</h1>

        <p className="failure-description">
          We can not seem to find the page you are looking for
        </p>

        <button className="failure-button" onClick={this.onClickRetry}>
          Retry
        </button>
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

  renderCompanyDetails = () => {
    const {jobItemData, skillsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      rating,
      id,
      employementType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      title,
    } = jobItemData
    console.log(typeof lifeAtCompany)

    return (
      <div className="details-card">
        <div className="logo-role">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="role-card">
            <h1 className="role">{title}</h1>
            <div className="rating-star">
              <FaStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="place-salary">
          <div className="location-job">
            <div className="location-card">
              <GrLocation className="icon" />
              <p className="location">{location}</p>
            </div>
            <div className="location-card second">
              <MdWork className="icon" />
              <p className="location">{employementType}</p>
            </div>
          </div>
          <p className="salary">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="link">
          <a href={companyWebsiteUrl} target="_blank">
            Visit
          </a>
        </div>
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
        <h1 className="skills-heading">Skills</h1>
        {this.renderSkills()}
        <div className="life-container">
          <h1 className="life-heading">Life at Company</h1>
          <div className="description-image"></div>
        </div>
        <h1 className="similar-heading">Similar Jobs</h1>
      </div>
    )
  }
  renderResults = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusValues.inProgress:
        return this.renderLoader()
      case apiStatusValues.success:
        return this.renderCompanyDetails()
      case apiStatusValues.failure:
        return this.renderFailure()
        default:
        return null
    }
  }

  render() {
    const {updatedJobDetails} = this.state
    return (
      <>
        <Header />
        <div className="details-container">{this.renderResults()}</div>
      </>
    )
  }
}

export default JobItemDetails

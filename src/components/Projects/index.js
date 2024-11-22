import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}
class Projects extends Component {
  constructor(props) {
    super(props)
    const {categoriesList} = this.props
    this.state = {
      projectsList: [],
      selectOption: categoriesList[0].id,
      apiStatus: apiConstants.initial,
    }
  }

  componentDidMount() {
    this.getProjectsList()
  }

  onChangeSelectOption = event => {
    this.setState({selectOption: event.target.value}, this.getProjectsList)
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiConstants.in_progress})
    const {selectOption} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${selectOption}`,
    )
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        imgUrl: each.image_url,
        name: each.name,
      }))
      this.setState({
        apiStatus: apiConstants.success,
        projectsList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }
  onClickRetryBtn = () => {
    this.getProjectsList()
  }

  renderAllViews = () => {
    const {projectsList, apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return (
          <ul>
            {projectsList.map(each => (
              <li key={each.id}>
                <img src={each.imgUrl} alt={each.name} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
        )
      case apiConstants.failure:
        return (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button type="button" onClick={this.onClickRetryBtn}>
              Retry
            </button>
          </div>
        )
      case apiConstants.in_progress:
        return (
          <div data-testid="loader" className="loader-container">
            <Loader type="ThreeDots" height={50} width={50} color="#328af2" />
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const {categoriesList} = this.props
    return (
      <div className="app-container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="container">
          <select onChange={this.onChangeSelectOption}>
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderAllViews()}
        </div>
      </div>
    )
  }
}

export default Projects

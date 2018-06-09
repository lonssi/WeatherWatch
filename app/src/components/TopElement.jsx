import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchWeatherData, fetchWeatherDataLocation } from '../actions/weatherActions.js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import { Helpers } from '../utils/helpers.js';


class TopElement extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			locationText: ""
		};
	};

	searchButtonClicked = () => {
		this.props.fetchWeatherData(this.state.locationText);
		this.clearInput();
		Helpers.hideVirtualKeyboard();
	};

	locationButtonClicked = () => {
		this.props.fetchWeatherDataLocation();
	};

	onKeyPress = (event) => {
		// On enter key press
		if (event.charCode === 13) {
			event.preventDefault();
			this.searchButtonClicked();
		}
	};

	handleInputChange = (event) => {
		this.setState({
			locationText: event.target.value
		});
	};

	clearInput = () => {
		this.setState({
			locationText: ""
		});
	};

	getLoader = () => {
		return (
			<LinearProgress
				style={{ backgroundColor: this.props.colorTheme.bg.light, "height": "2px" }}
				mode="indeterminate"
			/>
		);
	};

	render() {

		const locationDisabled = !navigator.geolocation;

		const buttonStyle = {
			width: '36px',
			minWidth: '36px',
		};

		const loading = this.props.weatherLoading || (this.props.weatherData && !this.props.imagesReady);
		const loader = (loading) ? this.getLoader() : null;

		return (
			<div className="top-container">
				<div className="top-wrapper">
					<div className="location-input-container">
						<form>
							<div className="location-button-container align-left">
								<Tooltip title="Get location">
									<Button
										onClick={this.locationButtonClicked}
										style={buttonStyle}
										disabled={locationDisabled}
									>
										<FontAwesomeIcon icon={"map-marker-alt"} />
									</Button>
								</Tooltip>
							</div>
							<TextField
								className="location-input-field"
								placeholder="Location"
								onKeyPress={this.onKeyPress}
								value={this.state.locationText}
								onChange={this.handleInputChange}
							/>
							<div className="location-button-container align-right">
								<Tooltip title="Search">
									<Button
										onClick={this.searchButtonClicked}
										style={buttonStyle}
									>
										<FontAwesomeIcon icon={"search"} />
									</Button>
								</Tooltip>
							</div>
						</form>
					</div>
					<div className="loader-container">
						{loader}
					</div>
				</div>
			</div>
		);
	}
}

TopElement.propTypes = {
	colorTheme: PropTypes.object,
	weatherLoading: PropTypes.bool.isRequired,
	weatherData: PropTypes.object,
	imagesReady: PropTypes.bool.isRequired
};

export default connect(
	(state) => {
		return {
			colorTheme: state.appReducer.colorTheme,
			weatherLoading: state.weatherReducer.loading,
			weatherData: state.weatherReducer.weatherData,
			imagesReady: state.appReducer.imagesReady
		}
	},
	{ fetchWeatherData, fetchWeatherDataLocation }
)(TopElement);

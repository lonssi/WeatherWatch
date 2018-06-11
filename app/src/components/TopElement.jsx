import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchWeatherData, fetchWeatherDataLocation } from '../actions/weatherActions.js';
import { Constants } from '../utils/constants';
import { Helpers } from '../utils/helpers.js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';


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

	getLocationButton = (buttonStyle) => {
		return (
			<div className="location-button-container align-left">
				<Tooltip
					title="Get location"
					enterDelay={Constants.tooltipDelay}
					disableFocusListener={true}
				>
					<Button
						onClick={this.locationButtonClicked}
						style={buttonStyle}
						disabled={!navigator.geolocation}
						aria-label="Get location"
					>
						<FontAwesomeIcon icon={"map-marker-alt"} />
					</Button>
				</Tooltip>
			</div>
		);
	};

	getTextField = () => {
		return (
			<TextField
				aria-label="Location"
				className="location-input-field"
				placeholder="Location"
				onKeyPress={this.onKeyPress}
				value={this.state.locationText}
				onChange={this.handleInputChange}
			/>
		);
	}

	getSearchButton = (buttonStyle) => {
		return (
			<div className="location-button-container align-right">
				<Tooltip
					title="Search"
					enterDelay={Constants.tooltipDelay}
					disableFocusListener={true}
				>
					<Button
						onClick={this.searchButtonClicked}
						style={buttonStyle}
						aria-label="Search"
					>
						<FontAwesomeIcon icon={"search"} />
					</Button>
				</Tooltip>
			</div>
		);
	};

	render() {

		const buttonStyle = { width: '36px', minWidth: '36px' };

		const locationButton = this.getLocationButton(buttonStyle);
		const textField = this.getTextField();
		const searchButton = this.getSearchButton(buttonStyle);

		const loading = this.props.weatherLoading || (this.props.weatherData && !this.props.imagesReady);
		const loader = (loading) ? this.getLoader() : null;

		return (
			<div className="top-container">
				<div className="top-wrapper">
					<div className="location-input-container">
						{locationButton}
						{textField}
						{searchButton}
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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
	fetchWeatherData, fetchWeatherDataLocation, resetWeatherData
} from '../actions/weatherActions';
import ButtonRow from './ButtonRow';
import { WeatherClockCanvas } from '../utils/WeatherClockCanvas.js';
import { Helpers } from '../utils/helpers.js';


class WeatherClock extends React.Component {

	constructor(props) {
		super(props);

		this.weatherclock = null;

		this.resizeThrottle = _.throttle(this.resize, 200);
		window.addEventListener('resize', this.resizeThrottle);

		this.visibilityHandler = () => ((document.hidden) ? this.stop : this.resume)();
		window.addEventListener('visibilitychange', this.visibilityHandler);
	};

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeThrottle);
		window.removeEventListener('visibilitychange', this.visibilityHandler);
		this.clearWeatherClock();
	};

	stop = () => {
		this.stopClockUpdate();
		this.stopWeatherPolling();
	};

	resume = () => {
		this.startClockUpdate();
		this.startWeatherPolling();
	};

	weatherClockHasData = () => {
		return this.weatherclock && this.props.weatherData;
	};

	fetchWeatherDataBackground = () => {

		// Don't fetch weather data if a previous loading is in progress
		if (this.props.weatherLoading) {
			return;
		}

		if (this.props.tracking) {
			this.props.fetchWeatherDataLocation();
		} else {
			this.props.fetchWeatherData(this.props.location);
		}
	};

	stopWeatherPolling = () => {
		if (this.weatherUpdateInterval) {
			clearInterval(this.weatherUpdateInterval);
		}
	};

	startWeatherPolling = () => {
		this.stopWeatherPolling();
		if (this.weatherClockHasData()) {
			this.checkWeatherDataUpToDateness();
			let self = this;
			this.weatherUpdateInterval = setInterval(() => {
				self.checkWeatherDataUpToDateness();
			}, 5000);
		}
	};

	checkWeatherDataUpToDateness = () => {
		if (Helpers.dataIsOutdated(this.props.weatherData, true)) {
			this.fetchWeatherDataBackground();
		}
	};

	clockUpdate = (flag) => {
		// If the application resumes after sleep
		// the data may have become outdated
		if (Helpers.dataIsOutdated(this.props.weatherData, false)) {
			this.clearWeatherClock();
			this.props.resetWeatherData();
			this.fetchWeatherDataBackground();
		} else {
			this.weatherclock.update(flag);
		}
	};

	startClockUpdate = () => {
		this.stopClockUpdate();
		if (this.weatherClockHasData()) {
			this.clockUpdate(true);
			let self = this;
			this.clockUpdateInterval = setInterval(() => {
				self.clockUpdate(false);
			}, 100);
		}
	};

	stopClockUpdate = () => {
		if (this.clockUpdateInterval) {
			clearInterval(this.clockUpdateInterval);
		}
	};

	resize = () => {
		if (this.weatherclock) {
			this.clockUpdate(true);
			this.forceUpdate();
		}
	};

	initializeCanvas = () => {

		this.weatherclock = new WeatherClockCanvas(
			this.refs.canvas,
			this.props.weatherData,
			this.props.clockSettings,
			this.refs.container,
			this.props.colorTheme
		);

		this.currentId = this.props.weatherData.id;

		this.startClockUpdate();
		this.startWeatherPolling();
	};

	clearWeatherClock = () => {

		this.stopWeatherPolling();
		this.stopClockUpdate();

		if (this.weatherclock) {
			this.weatherclock.clear();
			this.weatherclock = null;
		}
	};

	getLocationTextElement = () => {

		let locationText;

		const location = this.props.weatherData.location;
		const country = this.props.weatherData.country;

		if (country) {
			locationText = location + ", " + country;
		} else {
			if (location.includes(",")) {
				locationText = location.split(",").join(", ");
			} else {
				locationText = location;
			}
		}

		const n = locationText.length;
		const locationTextStyle = {};

		if (window.innerWidth < 480 && n >= 24) {
			const fontSize = (-0.375 * n + 25) + "px";
			locationTextStyle.fontSize = fontSize
		}

		return (
			<div className='location-text-container' style={locationTextStyle}>
				{locationText}
			</div>
		);
	};

	getUpdatedText = () => {

		const forecastTimezone = this.props.clockSettings.forecastTimezone;
		const updateTime = this.props.weatherData.time;
		const colorTheme = this.props.colorTheme;

		const tz = (forecastTimezone) ? { timeZone: this.props.weatherData.timeZone } : {};
		const tzHours = (forecastTimezone) ? this.props.weatherData.timeZoneOffset
			: -(new Date().getTimezoneOffset() / 60);
		const prefix = (tzHours >= 0) ? "+" : "";

		const updatedText = "last updated: " + (new Date(updateTime)).toLocaleString('en-GB', tz) + " " +
			"UTC" + prefix + tzHours;

		const styles = {
			color: colorTheme.text.dark
		};

		return (
			<div className="last-updated-container" style={styles}>
				<div className="text-container">
					{updatedText}
				</div>
			</div>
		);
	};

	render() {

		if (this.props.weatherData && !this.weatherclock && this.props.imagesReady) {
			this.initializeCanvas();
		}

		// If weather data changes, restart weather data polling
		if (this.weatherClockHasData() && (this.currentId !== this.props.weatherData.id)) {
			this.startWeatherPolling();
			this.currentId = this.props.weatherData.id;
		}

		if (this.weatherClockHasData()) {
			this.weatherclock.setSettings(this.props.clockSettings);
			this.weatherclock.updateWeatherData(this.props.weatherData);
			this.weatherclock.updateColorTheme(this.props.colorTheme);
			this.startClockUpdate();
		}

		if (this.weatherclock && !this.props.weatherData) {
			this.clearWeatherClock();
		}

		const locationTextElement = (this.weatherclock) ? this.getLocationTextElement() : null;
		const updatedTextElement = (this.weatherclock) ? this.getUpdatedText() : null;
		const buttons = (this.weatherclock) ? <ButtonRow/> : null;

		return (
			<div className="bottom-container">
				{locationTextElement}
				<div className="weather-clock-container" ref="container">
					<canvas ref="canvas"/>
				</div>
				{updatedTextElement}
				{buttons}
			</div>
		);
	}
}

WeatherClock.propTypes = {
	imagesReady: PropTypes.bool.isRequired,
	colorTheme: PropTypes.object.isRequired,
	weatherLoading: PropTypes.bool.isRequired,
	weatherData: PropTypes.object,
	location: PropTypes.string,
	tracking: PropTypes.bool.isRequired,
	clockSettings: PropTypes.object.isRequired
};

export default connect(
	(state) => {
		return {
			imagesReady: state.appReducer.imagesReady,
			colorTheme: state.appReducer.colorTheme,
			weatherLoading: state.weatherReducer.loading,
			weatherData: state.weatherReducer.weatherData,
			location: state.weatherReducer.location,
			tracking: state.weatherReducer.tracking,
			clockSettings: state.clockReducer,
		}
	},
	{
		fetchWeatherData,
		fetchWeatherDataLocation,
		resetWeatherData
	}
)(WeatherClock);

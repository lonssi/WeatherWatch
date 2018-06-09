import {
	RESET_WEATHER_DATA, FETCH_WEATHER_DATA_SUCCEEDED,
	FETCH_WEATHER_DATA_FAILED, FETCH_WEATHER_DATA_STARTED,
	OPEN_NOTIFICATION_DIALOG, SET_STATUS
} from './types';
import _ from 'lodash';
import xss from 'xss';
import Configuration from '../configuration';
import { Constants } from '../utils/constants';


/**
 * Check that the weather data version matches the local version
 * If not, reload the page
 * @param  {Object} data - weather data object
 */
let checkVersion = (data) => {
	if (data.version !== Constants.version) {
		window.location.reload();
	}
}

let fetchData = (location, tracking, dispatch) => {

	const locStr = encodeURIComponent(location.trim());
	const url = Configuration.WEATHER_API_URL + locStr;

	fetch(url)
		.then(result => result.json())
		.then(data => {
			if (data.status !== "success") {
				throw new Error(data.message);
			}
			return data;
		})
		.then(data => {
			checkVersion(data);
			data.id = data.location.toString() + data.time.toString();
			dispatch({
				type: FETCH_WEATHER_DATA_SUCCEEDED,
				payload: { data, tracking }
			});
		}
		).catch(error => {
			const errorMessage = (error.name !== "Error") ? "Unable to connect to server" : error.message;
			dispatch({
				type: FETCH_WEATHER_DATA_FAILED
			});
			dispatch({
				type: SET_STATUS,
				payload: errorMessage
			});
			dispatch({
				type: OPEN_NOTIFICATION_DIALOG
			});
		});
};

export const fetchWeatherDataLocation = (location) => dispatch => {

	let success = (position) => {
		const location = position.coords.longitude + "," + position.coords.latitude;
		fetchData(location, true, dispatch);
	};

	let failure = (error) => {

		let errorMessage;

		switch (error.code) {
			case error.PERMISSION_DENIED:
				errorMessage = "Location request denied"
				break;
			case error.POSITION_UNAVAILABLE:
				errorMessage = "Location information unavailable"
				break;
			case error.TIMEOUT:
				errorMessage = "Location request timed out"
				break;
			default:
				errorMessage = "Unknown error occurred"
				break;
		}

		dispatch({
			type: FETCH_WEATHER_DATA_FAILED
		});
		dispatch({
			type: SET_STATUS,
			payload: errorMessage
		});
		dispatch({
			type: OPEN_NOTIFICATION_DIALOG
		});
	};

	dispatch({
		type: FETCH_WEATHER_DATA_STARTED
	});

	navigator.geolocation.getCurrentPosition(success, failure);
};

export const fetchWeatherData = (location) => dispatch => {

	if (location.length === 0) {
		dispatch({
			type: OPEN_NOTIFICATION_DIALOG
		});
		dispatch({
			type: SET_STATUS,
			payload: 'Empty location name'
		});
		return;
	}

	dispatch({
		type: FETCH_WEATHER_DATA_STARTED
	});
	fetchData(location, false, dispatch);
};

export const fetchWeatherDataCached = () => dispatch => {
	// Check for cached location
	let location = xss(localStorage.getItem('location'));
	if (location && _.isString(location)) {
		dispatch({
			type: FETCH_WEATHER_DATA_STARTED
		});
		fetchData(location, false, dispatch);
	}
};

export const resetWeatherData = () => dispatch => {
	dispatch({
		type: RESET_WEATHER_DATA
	});
};

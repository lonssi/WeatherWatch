import {
	FETCH_WEATHER_DATA_SUCCEEDED,
	FETCH_WEATHER_DATA_FAILED,
	RESET_WEATHER_DATA,
	FETCH_WEATHER_DATA_STARTED
} from '../actions/types';

const initialState = {
	location: null,
	tracking: false,
	weatherData: null,
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case FETCH_WEATHER_DATA_STARTED:
			return {
				...state,
				loading: true
			};
		case FETCH_WEATHER_DATA_SUCCEEDED:
			const data = action.payload.data;
			localStorage.setItem('location', data.location);
			return {
				...state,
				loading: false,
				tracking: action.payload.tracking,
				weatherData: data,
				location: data.location
			};
		case FETCH_WEATHER_DATA_FAILED:
			return {
				...state,
				loading: false,
				tracking: false
			};
		case RESET_WEATHER_DATA:
			return {
				...state,
				weatherData: null
			};
		default:
			return state;
	}
}

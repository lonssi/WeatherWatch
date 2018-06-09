import {
	TOGGLE_FUTURE_MODE, SET_UNIT_MODE, SET_DATA_MODE,
	TOGGLE_FORECAST_TIMEZONE_MODE, TOGGLE_GRADIENT_MODE,
	TOGGLE_SECOND_HAND_MODE, SET_CLOCK_SIZE
} from './types';

export const toggleFutureMode = () => dispatch => {
	dispatch({
		type: TOGGLE_FUTURE_MODE,
	});
};

export const toggleForecastTimezoneMode = () => dispatch => {
	dispatch({
		type: TOGGLE_FORECAST_TIMEZONE_MODE,
	});
};

export const toggleGradientMode = () => dispatch => {
	dispatch({
		type: TOGGLE_GRADIENT_MODE,
	});
};

export const toggleSecondHandMode = () => dispatch => {
	dispatch({
		type: TOGGLE_SECOND_HAND_MODE,
	});
};

export const setUnitMode = (value) => dispatch => {
	dispatch({
		type: SET_UNIT_MODE,
		payload: value
	});
};

export const setDataMode = (value) => dispatch => {
	dispatch({
		type: SET_DATA_MODE,
		payload: value
	});
};

export const setClockSize = (value) => dispatch => {
	dispatch({
		type: SET_CLOCK_SIZE,
		payload: value
	});
};

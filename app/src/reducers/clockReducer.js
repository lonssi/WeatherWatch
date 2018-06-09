import _ from 'lodash';
import xss from 'xss';
import {
	TOGGLE_FUTURE_MODE, SET_UNIT_MODE, SET_DATA_MODE,
	TOGGLE_FORECAST_TIMEZONE_MODE, TOGGLE_GRADIENT_MODE,
	TOGGLE_SECOND_HAND_MODE, SET_CLOCK_SIZE
} from '../actions/types';
import { Helpers } from '../utils/helpers.js';
import {
	availableUnitModes, availableDataModes, availableClockSizes
} from '../assets/datatypes';


let getMatchingUnitMode = function(value) {
	if (_.isString(value)) {
		const unitMode = _.find(availableUnitModes, { id: value });
		if (unitMode) {
			return unitMode;
		}
	}
	return null;
};

let getMatchingDataMode = function(value, cache) {
	if (_.isString(value)) {
		const dataMode = _.find(availableDataModes, { id: value });
		if (dataMode) {
			return dataMode;
		}
	}
	return null;
};

let getMatchingClockSize = function(value, cache) {
	if (_.isString(value)) {
		const clockSize = _.find(availableClockSizes, { id: value });
		if (clockSize) {
			return clockSize;
		}
	}
	return null;
};

let getInitialState = function() {

	let state = {
		futureMode: false,
		unitMode: availableUnitModes[0],
		dataMode: availableDataModes[0],
		forecastTimezone: true,
		gradientMode: true,
		clockSize: availableClockSizes[1],
		secondHand: false,
	};

	let types = [
		{ id: 'unitMode', matchFunction: getMatchingUnitMode },
		{ id: 'dataMode', matchFunction: getMatchingDataMode },
		{ id: 'forecastTimezone', matchFunction: Helpers.toBoolean },
		{ id: 'gradientMode', matchFunction: Helpers.toBoolean },
		{ id: 'clockSize', matchFunction: Helpers.toBoolean },
		{ id: 'secondHand', matchFunction: Helpers.toBoolean }
	];

	for (let i in types) {
		let key = types[i].id;
		let matchFunction = types[i].matchFunction;
		let value = xss(localStorage.getItem(key));
		if (value) {
			let obj = matchFunction(value);
			if (!_.isNull(obj)) {
				state[key] = obj;
			}
		}
	}

	return state;
};

const initialState = getInitialState();

export default function(state = initialState, action) {
	switch (action.type) {
		case TOGGLE_FUTURE_MODE:
			return Helpers.stateToggleUtil('futureMode', state, false);
		case TOGGLE_FORECAST_TIMEZONE_MODE:
			return Helpers.stateToggleUtil('forecastTimezone', state, true);
		case TOGGLE_GRADIENT_MODE:
			return Helpers.stateToggleUtil('gradientMode', state, true);
		case TOGGLE_SECOND_HAND_MODE:
			return Helpers.stateToggleUtil('secondHand', state, true);
		case SET_UNIT_MODE:
			return Helpers.stateSelectUtil(
				action.payload, 'unitMode', getMatchingUnitMode, state, true
			);
		case SET_DATA_MODE:
			return Helpers.stateSelectUtil(
				action.payload, 'dataMode', getMatchingDataMode, state, true
			);
		case SET_CLOCK_SIZE:
			return Helpers.stateSelectUtil(
				action.payload, 'clockSize', getMatchingClockSize, state, true
			);
		default:
			return state;
	}
};

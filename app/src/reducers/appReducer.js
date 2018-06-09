import _ from 'lodash';
import xss from 'xss';
import {
	INITIALIZE_CLIENT, IMAGES_READY,
	SET_COLOR_THEME, SET_STATUS } from '../actions/types';
import { Colors } from '../utils/colors.js';
import { Helpers } from '../utils/helpers.js';


const initialState = {
	colorTheme: null,
	imagesReady: false,
	status: ""
};

let getMatchingColorTheme = function(value) {
	if (_.isString(value)) {
		const colorThemes = Colors.getColorThemes();
		const ct = _.find(colorThemes, { id: value });
		if (ct) {
			return ct;
		}
	}
	return null;
};

let getInitialColorTheme = function(width) {

	// First check for a cached color theme
	let value = xss(localStorage.getItem('colorTheme'));
	if (value) {
		let ct = getMatchingColorTheme(value);
		if (!_.isNull(ct)) {
			return ct;
		}
	}

	// If we are on a mobile device use the light
	// color theme by default because of better
	// visibility in outdoor lighting conditions
	let colorThemes = Colors.getColorThemes();
	if (width < 480) {
		return colorThemes[1];
	} else {
		return colorThemes[0];
	}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case INITIALIZE_CLIENT:
			return {
				...state,
				colorTheme: getInitialColorTheme(action.payload)
			};
		case SET_STATUS:
			return {
				...state,
				status: action.payload
			};
		case IMAGES_READY:
			return {
				...state,
				imagesReady: true
			};
		case SET_COLOR_THEME:
			return Helpers.stateSelectUtil(
				action.payload, 'colorTheme', getMatchingColorTheme, state, true
			);
		default:
			return state;
	}
};

import { INITIALIZE_CLIENT, IMAGES_READY, SET_COLOR_THEME } from './types';

export const initializeClient = (windowWidth) => dispatch => {
	dispatch({
		type: INITIALIZE_CLIENT,
		payload: windowWidth
	});
};

export const imagesReady = () => dispatch => {
	dispatch({
		type: IMAGES_READY
	});
};

export const setColorTheme = (id) => dispatch => {
	dispatch({
		type: SET_COLOR_THEME,
		payload: id
	});
};

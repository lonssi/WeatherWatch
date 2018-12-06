import {
	OPEN_ABOUT_DIALOG,
	CLOSE_ABOUT_DIALOG,
	OPEN_SETTINGS_DIALOG,
	CLOSE_SETTINGS_DIALOG,
	OPEN_NOTIFICATION_DIALOG,
	CLOSE_NOTIFICATION_DIALOG
} from '../actions/types';

export const openAboutDialog = () => dispatch => {
	dispatch({
		type: OPEN_ABOUT_DIALOG
	});
};

export const closeAboutDialog = () => dispatch => {
	dispatch({
		type: CLOSE_ABOUT_DIALOG
	});
};

export const openSettingsDialog = () => dispatch => {
	dispatch({
		type: OPEN_SETTINGS_DIALOG
	});
};

export const closeSettingsDialog = () => dispatch => {
	dispatch({
		type: CLOSE_SETTINGS_DIALOG
	});
};

export const openNotificationDialog = () => dispatch => {
	dispatch({
		type: OPEN_NOTIFICATION_DIALOG
	});
};

export const closeNotificationDialog = () => dispatch => {
	dispatch({
		type: CLOSE_NOTIFICATION_DIALOG
	});
};

import {
	OPEN_ABOUT_DIALOG, CLOSE_ABOUT_DIALOG,
	OPEN_SETTINGS_DIALOG, CLOSE_SETTINGS_DIALOG,
	OPEN_NOTIFICATION_DIALOG, CLOSE_NOTIFICATION_DIALOG
} from '../actions/types';

const initialState = {
	aboutDialogOpen: false,
	settingsDialogOpen: false,
	notificationDialogOpen: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case OPEN_ABOUT_DIALOG:
			return {
				...state,
				aboutDialogOpen: true
			};
		case CLOSE_ABOUT_DIALOG:
			return {
				...state,
				aboutDialogOpen: false
			};
		case OPEN_SETTINGS_DIALOG:
			return {
				...state,
				settingsDialogOpen: true
			};
		case CLOSE_SETTINGS_DIALOG:
			return {
				...state,
				settingsDialogOpen: false
			};
		case OPEN_NOTIFICATION_DIALOG:
			return {
				...state,
				notificationDialogOpen: true
			};
		case CLOSE_NOTIFICATION_DIALOG:
			return {
				...state,
				notificationDialogOpen: false
			};
		default:
			return state;
	}
};

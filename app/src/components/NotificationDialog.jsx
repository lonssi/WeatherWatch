import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeNotificationDialog } from '../actions/dialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class NotificationDialog extends React.Component {

	handleDialogClose = () => {
		this.props.closeNotificationDialog();
	};

	render() {

		return (

			<Dialog
				open={this.props.open}
				onClose={this.handleDialogClose}
				maxWidth="sm"
			>
				<DialogTitle>{"Error"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{this.props.status}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleDialogClose} autoFocus>
						CLOSE
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

NotificationDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	status: PropTypes.string.isRequired
};

export default connect(
	(state) => {
		return {
			open: state.dialogReducer.notificationDialogOpen,
			status: state.appReducer.status
		}
	},
	{ closeNotificationDialog }
)(NotificationDialog);

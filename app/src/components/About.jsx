import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeAboutDialog } from '../actions/dialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class About extends React.Component {
	handleDialogClose = () => {
		this.props.closeAboutDialog();
	};

	render() {
		const link = <a href="https://github.com/lonssi/WeatherWatch">GitHub</a>;

		return (
			<Dialog
				open={this.props.open}
				onClose={this.handleDialogClose}
				maxWidth="sm"
				disableRestoreFocus
			>
				<DialogTitle>About</DialogTitle>
				<DialogContent>
					<DialogContentText>
						The weather data is provided by the Finnish Meteorological
						Institute.
						<br />
						<br />
						WeatherWatch is open source: {link}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="primary"
						onClick={this.handleDialogClose}
						aria-label="Close"
						autoFocus
					>
						close
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

About.propTypes = {
	open: PropTypes.bool.isRequired
};

export default connect(
	state => {
		return {
			open: state.dialogReducer.aboutDialogOpen
		};
	},
	{ closeAboutDialog }
)(About);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { availableDataModes } from '../assets/store';
import { openSettingsDialog, openAboutDialog } from '../actions/dialogActions';
import { toggleFutureMode, setDataMode } from '../actions/clockActions';
import { Constants } from '../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';


class ButtonRow extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dataMenuOpen: false
		};
	};

	futureButtonClick = () => {
		this.props.toggleFutureMode();
	};

	dataModeButtonClick = (data) => {
		this.handleDataMenuRequestClose();
		this.props.setDataMode(data);
	};

	dotMenuButtonClick = (data) => {
		this.props.openSettingsDialog();
	};

	aboutDialogButtonClick = (data) => {
		this.props.openAboutDialog();
	};

	handleDataMenuTouchTap = (event) => {
		// This prevents ghost click
		event.preventDefault();
		this.setState({
			dataMenuOpen: true,
			anchorEl: event.currentTarget,
		});
	};

	handleDataMenuRequestClose = () => {
		this.setState({
			dataMenuOpen: false,
		});
	};

	render() {

		const settingsOpen = this.props.settingsOpen;
		const aboutDialogOpen = this.props.aboutDialogOpen;
		const clockSettings = this.props.clockSettings
		const colorTheme = this.props.colorTheme;

		const smallButtonStyle = {
			width: '36px',
			minWidth: '36px'
		};

		const dotMenuBtnStyle = (settingsOpen)
			? _.assign({}, smallButtonStyle, { backgroundColor: colorTheme.misc.select })
			: smallButtonStyle;

		const aboutDialogBtnStyle = (aboutDialogOpen)
			? _.assign({}, smallButtonStyle, { backgroundColor: colorTheme.misc.select })
			: smallButtonStyle;

		const dataMenuButtonStyle = (this.state.dataMenuOpen) ?
			{ backgroundColor: colorTheme.misc.select } : {};

		const futureButtonStyle = (clockSettings.futureMode) ?
			{ backgroundColor: colorTheme.misc.select } : {};

		const dataModeItems = availableDataModes.map((item) => {
			return (
				<MenuItem
					selected={item.id === clockSettings.dataMode.id}
					key={item.id}
					onClick={this.dataModeButtonClick.bind(null, item.id)}
				>
					<ListItemIcon>
						<div className="unit-icon-container">
							<FontAwesomeIcon icon={item.icon} />
						</div>
					</ListItemIcon>
					<ListItemText inset primary={item.text} />
				</MenuItem>
			);
		});

		const dataButton = (
			<React.Fragment>
				<Tooltip
					title="Select data type"
					enterDelay={Constants.tooltipDelay}
				>
					<Button
						onClick={this.handleDataMenuTouchTap}
						style={dataMenuButtonStyle}
						aria-label="Select data type"
					>
						<div className="button-unit-icon-container">
							<FontAwesomeIcon icon={clockSettings.dataMode.icon} />
						</div>
						data
					</Button>
				</Tooltip>

				<Menu
					id="simple-menu"
					anchorEl={this.state.anchorEl}
					open={this.state.dataMenuOpen}
					onClose={this.handleDataMenuRequestClose}
					disableRestoreFocus
				>
					{dataModeItems}
				</Menu>
			</React.Fragment>
		);

		const settingsButton = (
			<Tooltip
				title="Settings"
				enterDelay={Constants.tooltipDelay}
			>
				<Button
					onClick={this.dotMenuButtonClick}
					style={dotMenuBtnStyle}
					aria-label="Settings"
				>
					<div>
						<FontAwesomeIcon icon="cog" />
					</div>
				</Button>
			</Tooltip>
		);

		const aboutButton = (
			<Tooltip
				title="About"
				enterDelay={Constants.tooltipDelay}
			>
				<Button
					onClick={this.aboutDialogButtonClick}
					style={aboutDialogBtnStyle}
					aria-label="About"
				>
					<div>
						<FontAwesomeIcon icon="question" />
					</div>
				</Button>
			</Tooltip>
		);

		const futureButton = (
			<Tooltip
				title="12 hours forward"
				enterDelay={Constants.tooltipDelay}
			>
				<Button
					onClick={this.futureButtonClick}
					style={futureButtonStyle}
					aria-label="12 hours forward"
				>
					<div className="button-unit-icon-container">
						<FontAwesomeIcon icon="clock" />
					</div>
					+12h
				</Button>
			</Tooltip>
		);

		return (
			<div className="buttons-container">
				{dataButton}
				{settingsButton}
				{aboutButton}
				{futureButton}
			</div>
		);
	}
}

ButtonRow.propTypes = {
	clockSettings: PropTypes.object.isRequired,
	settingsOpen: PropTypes.bool.isRequired,
	aboutDialogOpen: PropTypes.bool.isRequired,
	colorTheme: PropTypes.object.isRequired
};

export default connect(
	(state) => {
		return {
			clockSettings: state.clockReducer,
			settingsOpen: state.dialogReducer.settingsDialogOpen,
			aboutDialogOpen: state.dialogReducer.aboutDialogOpen,
			colorTheme: state.appReducer.colorTheme
		}
	},
	{
		openSettingsDialog,
		openAboutDialog,
		toggleFutureMode,
		setDataMode
	}
)(ButtonRow);

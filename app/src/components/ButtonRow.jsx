import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { availableDataModes } from '../assets/datatypes';
import { openSettingsDialog, openAboutDialog } from '../actions/dialogActions';
import { toggleFutureMode, setDataMode } from '../actions/clockActions';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
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

		const dataModeItems = availableDataModes.map(function(item) {
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
		}.bind(this));

		return (
			<div className="buttons-container">
				<Tooltip title="Select data type">
					<Button
						onClick={this.handleDataMenuTouchTap}
						style={dataMenuButtonStyle}
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
					disableRestoreFocus={true}
				>
					{dataModeItems}
				</Menu>

				<Tooltip title="Settings">
					<Button
						onClick={this.dotMenuButtonClick}
						style={dotMenuBtnStyle}
					>
						<div>
							<FontAwesomeIcon icon={"ellipsis-v"} />
						</div>
					</Button>
				</Tooltip>

				<Tooltip title="About">
					<Button
						onClick={this.aboutDialogButtonClick}
						style={aboutDialogBtnStyle}
					>
						<div>
							<FontAwesomeIcon icon={"question"} />
						</div>
					</Button>
				</Tooltip>

				<Tooltip title="12 hours forward">
					<Button
						onClick={this.futureButtonClick}
						style={futureButtonStyle}
					>
						<div className="button-unit-icon-container">
							<FontAwesomeIcon icon={"clock"} />
						</div>
						+12h
					</Button>
				</Tooltip>
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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeSettingsDialog } from '../actions/dialogActions';
import { setColorTheme } from '../actions/appActions';
import {
	setUnitMode, toggleForecastTimezoneMode, toggleGradientMode,
	toggleSecondHandMode, setClockSize
} from '../actions/clockActions';
import {
	availableUnitModes, availableClockSizes
} from '../assets/store';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { Colors } from '../utils/colors.js';


class Settings extends React.Component {

	handleDialogClose = () => {
		this.props.closeSettingsDialog();
	};

	tzModeToggled = () => {
		this.props.toggleForecastTimezoneMode();
	};

	gradientModeToggled = () => {
		this.props.toggleGradientMode();
	};

	secondHandToggled = () => {
		this.props.toggleSecondHandMode();
	};

	colorThemeChange = (event) => {
		this.props.setColorTheme(event.target.value);
	};

	unitModeChange = (event) => {
		this.props.setUnitMode(event.target.value);
	};

	clockSizeChange = (event) => {
		this.props.setClockSize(event.target.value);
	};

	getCheckBoxes = () => {
		return (
			<div className="settings-check-boxes">
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.props.clockSettings.gradientMode}
								onChange={this.gradientModeToggled}
							/>
						}
						label="Gradient mode"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.props.clockSettings.forecastTimezone}
								onChange={this.tzModeToggled}
							/>
						}
						label="Forecast timezone"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.props.clockSettings.secondHand}
								onChange={this.secondHandToggled}
							/>
						}
						label="Second hand"
					/>
				</FormGroup>
			</div>
		);
	};

	getSelectFields = () => {

		const selectFieldStyle = {
			color: this.props.colorTheme.text.light,
			width: '280px',
			maxWidth: "100%"
		};

		const colorThemeItems = this.props.colorThemes.map((item) => {
			return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
		});

		const unitModeItems = availableUnitModes.map((item) => {
			return <MenuItem key={item.id} value={item.id}>{item.text}</MenuItem>;
		});

		const clockSizeItems = availableClockSizes.map((item) => {
			return <MenuItem key={item.id} value={item.id}>{item.text}</MenuItem>;
		});

		return (
			<FormGroup>
				<FormControl>
					<InputLabel htmlFor="Color theme">Color theme</InputLabel>
					<Select
						value={this.props.colorTheme.id}
						onChange={this.colorThemeChange}
						style={selectFieldStyle}
						className="select-field"
					>
						{colorThemeItems}
					</Select>
				</FormControl>
				<br />
				<FormControl>
					<InputLabel htmlFor="Units">Units</InputLabel>
					<Select
						value={this.props.clockSettings.unitMode.id}
						onChange={this.unitModeChange}
						style={selectFieldStyle}
						className="select-field"
					>
						{unitModeItems}
					</Select>
				</FormControl>
				<br />
				<FormControl>
					<InputLabel htmlFor="Clock size">Clock size</InputLabel>
					<Select
						value={this.props.clockSettings.clockSize.id}
						onChange={this.clockSizeChange}
						style={selectFieldStyle}
						className="select-field"
					>
						{clockSizeItems}
					</Select>
				</FormControl>
			</FormGroup>
		);
	};

	render() {

		const checkBoxes = this.getCheckBoxes();
		const selectFields = this.getSelectFields();

		return (
			<div>
				<Dialog
					open={this.props.open}
					onClose={this.handleDialogClose}
				>
					<DialogTitle>Settings</DialogTitle>
					<DialogContent>
						<div className="settings-container">
							{checkBoxes}
							{selectFields}
						</div>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={this.handleDialogClose}
							aria-label="Close"
							autoFocus
						>
							close
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

Settings.propTypes = {
	open: PropTypes.bool.isRequired,
	clockSettings: PropTypes.object.isRequired,
	colorTheme: PropTypes.object.isRequired,
	colorThemes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default connect(
	(state) => {
		return {
			open: state.dialogReducer.settingsDialogOpen,
			clockSettings: state.clockReducer,
			colorTheme: state.appReducer.colorTheme,
			colorThemes: Colors.getColorThemes(),
		}
	},
	{
		closeSettingsDialog,
		toggleForecastTimezoneMode,
		toggleGradientMode,
		toggleSecondHandMode,
		setColorTheme,
		setUnitMode,
		setClockSize
	}
)(Settings);

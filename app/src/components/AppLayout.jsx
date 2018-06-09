import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Images } from '../assets/images';
import { initializeClient } from '../actions/appActions';
import { fetchWeatherDataCached } from '../actions/weatherActions';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import chroma from 'chroma-js';
import NotificationDialog from './NotificationDialog';
import AboutDialog from './AboutDialog';
import Settings from './Settings';
import TopElement from './TopElement';
import WeatherClock from './WeatherClock';


let firstLoad = true;

class AppLayout extends React.Component {

	componentWillMount() {
		Images.loadImages();
		this.props.initializeClient(window.innerWidth);
		this.props.fetchWeatherDataCached();
	};

	setBodyStyles = (colorTheme) => {

		document.body.style.setProperty('--text-color', colorTheme.text.light);
		document.body.style.setProperty('--background-color', colorTheme.bg.light);
		document.body.style.setProperty('--line-color', colorTheme.misc.border);
		document.body.style.setProperty('--link-color', colorTheme.accent.light);
		const linkHoverColor = chroma(colorTheme.accent.light).brighten(1).css();
		document.body.style.setProperty('--link-hover-color', linkHoverColor);

		// Add the transition effects after the page has loaded
		if (firstLoad) {
			firstLoad = false;
			setTimeout(function () {
				document.body.style["-webkit-transition"] = "color 0.5s ease-out";
				document.body.style["-moz-transition"] = "color 0.5s ease-out";
				document.body.style["-o-transition"] = "color 0.5s ease-out";
				document.body.style["transition"] = "color 0.5s ease-out";
				document.body.style["-webkit-transition"] = "background-color 0.5s ease-out";
				document.body.style["-moz-transition"] = "background-color 0.5s ease-out";
				document.body.style["-o-transition"] = "background-color 0.5s ease-out";
				document.body.style["transition"] = "background-color 0.5s ease-out";
			}, 500);
		}
	};

	render() {

		const colorTheme = this.props.colorTheme;

		if (!colorTheme) {
			return null;
		}

		const hover = (colorTheme.id === "dark")
			? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

		const selected = (colorTheme.id === "dark")
			? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.14)";

		const muiTheme = createMuiTheme({
			overrides: {
				MuiTooltip: {
					tooltip: {
						color: colorTheme.text.light,
						backgroundColor: colorTheme.bg.darker
					}
				}
			},
			palette: {
				type: colorTheme.id,
				common: {
					white: colorTheme.text.light
				},
				primary: {
					light: colorTheme.accent.light,
					main: colorTheme.accent.light,
					dark: colorTheme.accent.light,
					contrastText: colorTheme.accent.light,
				},
				secondary: {
					light: colorTheme.accent.light,
					main: colorTheme.accent.light,
					dark: colorTheme.accent.light,
					contrastText: colorTheme.accent.light,
				},
				background: {
					paper: colorTheme.misc.menu,
				},
				text: {
					primary: colorTheme.text.light,
					secondary: colorTheme.text.dark,
					disabled: colorTheme.text.darker,
					hint: colorTheme.misc.hint
				},
				action: {
					active: colorTheme.text.light,
					hover: hover,
					selected: selected,
				}
			}
		});

		this.setBodyStyles(colorTheme);

		return (
			<MuiThemeProvider theme={muiTheme}>
				<div className="content-container">
					<NotificationDialog/>
					<AboutDialog/>
					<Settings/>
					<TopElement/>
					<div className="bottom-container">
						<WeatherClock/>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

AppLayout.propTypes = {
	colorTheme: PropTypes.object
};

export default connect(
	(state) => {
		return {
			colorTheme: state.appReducer.colorTheme,
		}
	},
	{
		initializeClient,
		fetchWeatherDataCached
	}
)(AppLayout);

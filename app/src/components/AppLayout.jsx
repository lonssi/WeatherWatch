import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Images } from '../assets/images';
import { initializeClient } from '../actions/appActions';
import { fetchWeatherDataCached } from '../actions/weatherActions';
import { Colors } from '../utils/colors';
import { MuiThemeProvider } from '@material-ui/core/styles';
import chroma from 'chroma-js';
import Notification from './Notification';
import About from './About';
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

		this.setBodyStyles(colorTheme);

		return (
			<MuiThemeProvider theme={Colors.getMuiTheme(colorTheme)}>
				<div className="content-container">
					<Notification/>
					<About/>
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

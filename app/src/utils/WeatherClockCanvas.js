import { Helpers } from './helpers.js';
import { Constants } from './constants.js';
import { MoonPainter } from './MoonPainter.js';
import { dataTypes } from '../assets/store';
import { Images } from '../assets/images';
import { UPDATE_CLOCK, UPDATE_DATA, UPDATE_ALL } from '../actions/types';
import './ArcGradient.js';
import chroma from 'chroma-js';
import _ from 'lodash';


const identity = [1, 0, 0, 1, 0, 0, 1, 0, 0];
const deg2rad = Math.PI / 180;
const arc = 2 * Math.PI;


export class WeatherClockCanvas {

	constructor(canvas, weatherData, clockSettings, container, colorTheme) {

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		this.canvasData = document.createElement('canvas');
		this.ctxData = this.canvasData.getContext('2d');

		this.canvasBg = document.createElement('canvas');
		this.ctxBg = this.canvasBg.getContext('2d');

		this.fontFamily = "roboto, sans-serif";

		this.images = Images.images;

		this.weatherData = weatherData;
		this.settings = clockSettings;
		this.container = container;
		this.colorTheme = colorTheme;

		this.datePrev = new Date();
		this.updateThreshold = (clockSettings.secondHand) ? 1000 : 5000;
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	updateWeatherData(data) {
		this.weatherData = data;
	}

	setSettings(value) {
		this.settings = value;
		this.updateThreshold = (this.settings.secondHand) ? 1000 : 5000;
	}

	updateColorTheme(data) {
		this.colorTheme = data;
	}

	update(updateFlag) {

		if (!this.weatherData) {
			return;
		}

		this.date = new Date();

		if (updateFlag === UPDATE_CLOCK) {
			// Draw all elements if the starting hour has changed
			if (this.date.getHours() !== this.datePrev.getHours()) {
				updateFlag = UPDATE_ALL
			}
		}

		if (updateFlag === UPDATE_CLOCK) {
			// No redrawing if the time threshold is not exceeded
			if (this.date - this.datePrev < this.updateThreshold) {
				return;
			}
		}

		if (updateFlag === UPDATE_DATA || updateFlag === UPDATE_ALL) {
			this.resize();
		} else {
			this.clear();
		}

		if (this.settings.forecastTimezone) {
			this.tzOffset = (this.date.getTimezoneOffset() / 60) + this.weatherData.timeZoneOffset;
		} else {
			this.tzOffset = 0;
		}

		if (updateFlag === UPDATE_ALL) {
			this.updateWeatherBackground();
		}

		if (updateFlag === UPDATE_DATA || updateFlag === UPDATE_ALL) {
			this.drawStaticElementsToCache();
		}

		this.drawStaticElementsFromCache();

		// Draw dynamic elements
		this.drawClockHands();

		this.datePrev = this.date;
	}

	resize() {

		this.ratio = (function () {
			let ctx = document.createElement("canvas").getContext("2d"),
				dpr = window.devicePixelRatio || 1,
				bsr = ctx.webkitBackingStorePixelRatio ||
					ctx.mozBackingStorePixelRatio ||
					ctx.msBackingStorePixelRatio ||
					ctx.oBackingStorePixelRatio ||
					ctx.backingStorePixelRatio || 1;
			return dpr / bsr;
		})();

		const w = this.container.clientWidth;
		const h = this.container.clientHeight;
		const size = (w > h) ? h : w;

		this.canvas.width = size * this.ratio;
		this.canvas.height = size * this.ratio;
		this.canvas.style.width = size + 'px';
		this.canvas.style.height = size + 'px';

		this.canvasData.width = this.canvas.width;
		this.canvasData.height = this.canvas.height;
		this.canvasData.style.width = this.canvas.style.width;
		this.canvasData.style.height = this.canvas.style.height;

		this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 }

		this.bound = this.canvas.height;
		this.unit = this.bound / 33;
		this.arcWidth = this.settings.clockSize.size * this.unit;
		this.arcWidthInner = this.arcWidth - 2 * this.unit;
		this.rimCenterRadius = this.bound / 2 - this.arcWidth / 2;
		this.innerRadius = this.bound / 2 - this.arcWidth;
		this.clockRadius = this.innerRadius - this.unit;
	}

	drawStaticElementsFromCache() {
		this.ctx.drawImage(this.canvasData, 0, 0);
	}

	drawClockHands() {

		const hours = this.date.getHours() + this.tzOffset;
		const minutes = this.date.getMinutes();
		const seconds = this.date.getSeconds();

		const minuteIndicatorLength = this.clockRadius - this.unit - this.clockRadius / 28;
		const hourIndicatorLength =  minuteIndicatorLength / 1.5;

		this.drawIndicator(
			this.ctx,
			this.colorTheme.accent.dark,
			this.clockRadius * 0.04,
			(hours + minutes/60 + seconds/3600) * 30,
			[0, hourIndicatorLength]
		);

		this.drawIndicator(
			this.ctx,
			this.colorTheme.accent.light,
			Math.max(1, this.clockRadius * 0.022),
			(minutes + seconds/60) * 6,
			[0, minuteIndicatorLength]
		);

		if (this.settings.secondHand) {
			this.drawIndicator(
				this.ctx,
				this.colorTheme.accent.light,
				Math.max(1, this.clockRadius * 0.012),
				seconds * 6,
				[0, minuteIndicatorLength]
			);
		}

		this.ctx.beginPath();
		this.ctx.arc(this.center.x, this.center.y, this.clockRadius * 0.055, 0, arc);
		this.ctx.fillStyle = this.colorTheme.accent.light;
		this.ctx.fill();
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.arc(this.center.x, this.center.y, this.clockRadius * 0.0225, 0, arc);
		this.ctx.fillStyle = this.colorTheme.accent.dark;
		this.ctx.fill();
		this.ctx.closePath();
	}

	drawIndicator(ctx, color, width, angle, range) {

		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.lineCap = 'round';

		angle = (angle - 180) * deg2rad;

		ctx.beginPath();
		ctx.translate(this.center.x, this.center.y);
		ctx.rotate(angle);
		ctx.moveTo(0, range[0]);
		ctx.lineTo(0, range[1]);
		ctx.stroke();
		ctx.setTransform(...identity);
	}

	drawStaticElementsToCache() {

		this.ctxData.textBaseline = "middle";
		this.ctxData.textAlign = "center";

		this.drawWeatherBackground();
		this.drawClockFace();
		this.drawCelestialObjectIndicators();
		this.drawDataModeContent();
	}

	drawClockFace() {

		// Draw background
		this.ctxData.beginPath();
		this.ctxData.arc(this.center.x, this.center.y, this.clockRadius, 0, arc);
		this.ctxData.fillStyle = this.colorTheme.bg.clock;
		this.ctxData.fill();
		this.ctxData.closePath();

		// Text settings
		this.ctxData.font = this.unit * 1.25 + "px " + this.fontFamily;
		this.ctxData.fillStyle = this.colorTheme.text.dark;

		let dateHour = Helpers.getClosestStartingHourDate(this.date) +
			this.tzOffset * Constants.hourEpochs;

		if (this.settings.futureMode) {
			dateHour += 12 * Constants.hourEpochs;
		}

		const hour = new Date(dateHour).getHours();

		this.ctxData.lineCap = 'round';
		this.ctxData.lineWidth = this.clockRadius / 54;
		this.ctxData.strokeStyle = this.colorTheme.misc.clock;

		for (let i = hour; i < hour + 12; i++) {

			const angle = (i * 30) * deg2rad;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.clockRadius + this.unit);
			this.ctxData.beginPath();

			if (i % 3 === 0) {
				this.ctxData.translate(0, this.clockRadius * 0.225);
				this.ctxData.rotate(-angle);
				this.ctxData.fillText(i % 24, 0, 0);
				this.ctxData.rotate(angle);
				this.ctxData.translate(0, -this.clockRadius * 0.225);
			}

			this.ctxData.moveTo(0, 0);
			this.ctxData.lineTo(0, this.clockRadius / 14);
			this.ctxData.stroke();

			this.ctxData.setTransform(...identity);
		}
	}

	updateWeatherBackground() {

		this.canvasBg.width = this.canvas.width;
		this.canvasBg.height = this.canvas.height;
		this.canvasBg.style.width = this.canvas.style.width;
		this.canvasBg.style.height = this.canvas.style.height;

		const location = this.rimCenterRadius;
		const width = this.arcWidth / 2;

		const lightness = (this.colorTheme.id === 'dark') ? 0.0275 : 0.04;
		const color1 = this.colorTheme.bg.dark;
		const color2 = chroma(color1).set('hsl.l', '+' + lightness).css();
		const colors = [color2, color1];

		const hours = this.date.getHours() + this.tzOffset;
		const value = hours % 12;
		const valueDeg = value / 12 * 360;
		const span = 30 / 180 * Math.PI;
		const startAngle = valueDeg * deg2rad - Math.PI / 2 - span / 2;
		const endAngle = startAngle + arc;

		const gradients = [{ startAngle, endAngle, colors }];

		this.drawArcGradients(this.ctxBg, location, width, gradients);
	}

	drawWeatherBackground() {
		this.ctxData.translate(this.center.x, this.center.y);
		if (!this.settings.forecastTimezone) {
			const angle = this.tzOffset % 12 * deg2rad;
			this.ctxData.rotate(angle);
		}
		this.ctxData.drawImage(this.canvasBg, -this.center.x, -this.center.y);
		this.ctxData.setTransform(...identity);
	}

	drawCelestialObjectIndicators() {

		const thickness = this.unit;
		const location = this.clockRadius + this.unit / 2;

		const dataMode = this.settings.dataMode.id;
		const upColor = (dataMode === 'moon') ? this.colorTheme.static.moon_bright_up : '#FABA25';

		this.ctxData.lineWidth = thickness;
		this.ctxData.lineCap = 'butt';

		let now = new Date(Helpers.getClosestStartingHourDate(this.date));

		if (this.settings.futureMode) {
			now = new Date(now.getTime() + 12 * Constants.hourEpochs);
		}

		const rawEvents = (dataMode !== 'moon') ? this.weatherData.sunEvents : this.weatherData.moonEvents;
		const events = this.getCelestialEvents(now, rawEvents);
		const n = events.length;

		// SunCalc may have missing rise/set events when the sun is
		// above or below the horizon for an extended period of time.
		// Check if the sun altitude conforms with the rise/set events
		// and apply a correction if not.
		if (n === 2) {
			// Find the weatherObject closest to the middle of the event span
			let weatherObject;
			let minDiff = Infinity;
			let middleTime = new Date((events[1].time - events[0].time) / 2 + events[0].time.getTime());
			for (let i = 0; i < this.weatherData.values.length; i++) {
				let wo = this.weatherData.values[i];
				let time = new Date(wo.time);
				if (events[0].time <= time && time <= events[1].time) {
					let diff = Math.abs(middleTime - time);
					if (diff < minDiff) {
						weatherObject = wo;
						minDiff = diff;
					}
				}
			}
			if (weatherObject) {
				const key = (dataMode === 'moon') ? "moonPosition" : "sunPosition";
				const up = weatherObject[key].altitude >= 0;
				// Invert the events in the case of mismatch
				if (up !== events[0].up) {
					events[0].up = !events[0].up;
					events[1].up = !events[1].up;
				}
			}
		}

		for (let i = 0; i < n; i++) {

			if (!((i !== 0) ^ (i !== n - 1))) {
				continue;
			}

			const event = events[i];
			const up = (i === 0) ? event.up : !events[n - 1].up;
			const color = (up) ? upColor : this.colorTheme.misc.down;
			const date = event.time;
			const hour = date.getHours() + date.getMinutes() / 60 + this.tzOffset;
			const angle = (hour % 12) / 12 * arc;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -location);
			this.ctxData.beginPath();
			this.ctxData.arc(0, 0, thickness / 2, 0, arc);
			this.ctxData.fillStyle = color;
			this.ctxData.fill();
			this.ctxData.setTransform(...identity);
		}

		const intervals = [];
		for (let i = 1; i < n; i++) {
			intervals.push({
				start: events[i - 1].time,
				end: events[i].time,
				up: !events[i].up
			});
		}

		for (let i = 0; i < intervals.length; i++) {

			const interval = intervals[i];
			const color = (interval.up) ? upColor : this.colorTheme.misc.down;

			const startDate = interval.start;
			const endDate = interval.end;

			const startHour = startDate.getHours() + startDate.getMinutes() / 60 + this.tzOffset;
			const endHour = endDate.getHours() + endDate.getMinutes() / 60 + this.tzOffset;

			const startAngle = (startHour % 12) / 12 * arc - (Math.PI / 2);
			const endAngle = (endHour % 12) / 12 * arc - (Math.PI / 2);

			this.ctxData.strokeStyle = color;
			this.ctxData.beginPath();
			this.ctxData.arc(this.center.x, this.center.y, location, startAngle, endAngle);
			this.ctxData.stroke();
		}
	}

	getCelestialEvents(start, initEvents) {

		const end = new Date(start.getTime() + 11 * Constants.hourEpochs);

		const eventsAll = [];

		for (let i = 0; i < initEvents.rises.length; i++) {
			eventsAll.push({
				up: true,
				time: new Date(initEvents.rises[i])
			});
		}

		for (let i = 0; i < initEvents.sets.length; i++) {
			eventsAll.push({
				up: false,
				time: new Date(initEvents.sets[i])
			});
		}

		eventsAll.sort(function(a, b) { return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0); } );

		// Check which events are within time interval
		const events = [];
		let overEvent = null;
		for (let i = 0; i < eventsAll.length; i++) {
			const event = eventsAll[i];
			if (start <= event.time && event.time <= end) {
				events.push(event);
			}
			// Store the first event that exceeds time scope
			if (event.time > end) {
				overEvent = event;
				break;
			}
		}

		const n = events.length;

		let startUp, endUp;
		if (n > 0) {
			startUp = !events[0].up;
			endUp = !events[n - 1].up;
		} else {
			startUp = !overEvent.up;
			endUp = !startUp;
		}

		// Add the beginning of time scope as an event
		events.unshift({
			up: startUp,
			time: start
		});

		// Add the end of time scope as an event
		events.push({
			up: endUp,
			time: end
		});

		return events;
	}

	getWeatherDataArray() {

		let dateHour = Helpers.getClosestStartingHourDate(this.date);

		if (this.settings.futureMode) {
			dateHour += 12 * Constants.hourEpochs;
		}

		const weatherDataArray = [];

		for (let i = 0; i < 12; i++) {

			const date = dateHour + i * Constants.hourEpochs;

			let found = false;
			for (let j in this.weatherData.values) {
				if (date === this.weatherData.values[j].time) {
					found = true;
					weatherDataArray.push(this.weatherData.values[j]);
					break;
				}
			}

			if (!found) {
				return null;
			}
		}

		return weatherDataArray;
	}

	drawDataModeContent() {

		const weatherDataArray = this.getWeatherDataArray();
		const dataMode = this.settings.dataMode;
		const dataType = _.find(dataTypes, { id: dataMode.id })

		const colors = [];
		if (dataType) {
			for (let index in weatherDataArray) {
				const weatherObject = weatherDataArray[index];
				const measure = weatherObject[dataType.key];
				const roundFunction = dataType.roundFunction;
				const rounded = roundFunction(measure);
				const color = dataType.colorFunction(rounded);
				const colorFinal = (color) ? color : this.colorTheme.bg.empty;
				colors.push(colorFinal);
			}
		}

		switch (dataMode.id) {
			default:
			case "weather":
				this.drawWeatherData(weatherDataArray);
				break;
			case "temperature":
				this.drawTemperatureData(weatherDataArray, colors);
				break;
			case "rain":
				this.drawRainData(weatherDataArray, colors);
				break;
			case "humidity":
				this.drawHumidityData(weatherDataArray, colors);
				break;
			case "wind":
				this.drawWindData(weatherDataArray, colors);
				break;
			case "cloud":
				this.drawCloudData(weatherDataArray, colors);
				break;
			case "moon":
				this.drawMoonData(weatherDataArray);
				break;
		}
	}

	drawWeatherData(weatherDataArray) {

		this.ctxData.fillStyle = this.colorTheme.text.dark;
		const textOffset = this.arcWidth * 0.02;

		// Weather icon scaling
		const width = this.arcWidth * 0.625;
		const height = this.arcWidth * 0.625;

		const hours = this.date.getHours() + this.tzOffset;

		const translation = this.rimCenterRadius + this.arcWidth * 0.265;

		for (let i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const temperature = weatherObject.Temperature;
			const unitMode = this.settings.unitMode.id;
			const tempShow = (unitMode === "si") ? temperature : temperature * (9/5) + 32;
			const tempRoundedStr = Helpers.floatToString(tempShow, 0);
			const weatherCode = parseInt(weatherObject.WeatherSymbol3, 10);
			const imageKey = (weatherObject.sunPosition.altitude > 0) ? "day" : "night";
			const image = this.images[weatherCode][imageKey];
			const angle = ((i + hours) * 30) * deg2rad;

			if (Helpers.numberLength(tempRoundedStr) > 2) {
				this.ctxData.font = this.arcWidth * 0.18 + "px " + this.fontFamily;
			} else {
				this.ctxData.font = this.arcWidth * 0.2 + "px " + this.fontFamily;
			}

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -translation);

			this.ctxData.rotate(-angle);
			this.ctxData.fillText(tempRoundedStr + "°", textOffset, 0);
			this.ctxData.rotate(angle);

			this.ctxData.translate(0, this.arcWidth * 0.434);
			this.ctxData.rotate(-angle);
			this.ctxData.drawImage(image, -width / 2, -height / 2, width, height);

			this.ctxData.setTransform(...identity);
		}
	}

	drawTemperatureData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		const textOffset = this.arcWidth * 0.005;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(this.ctxData, colors, hours);
		}

		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;

		for (let i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const temperature = weatherObject.Temperature;
			const unitMode = this.settings.unitMode.id;
			const tempInt = parseInt(Helpers.floatToString(temperature, 0), 10);
			const tempShow = (unitMode === "si") ? temperature : temperature * (9/5) + 32;
			const angle = ((i + hours) * 30) * deg2rad;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);
			this.ctxData.fillStyle = (tempInt > 0) ? this.colorTheme.text.data : '#FFF';
			this.ctxData.fillText(Helpers.floatToString(tempShow, 0) + "°", textOffset, 0);
			this.ctxData.setTransform(...identity);
		}
	}

	drawRainData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(this.ctxData, colors, hours);
		}

		this.ctxData.fillStyle = this.colorTheme.text.data;
		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily

		for (let i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const precip = weatherObject.Precipitation1h;

			let precipShow;
			if (this.settings.unitMode.id === 'si') {
				precipShow = precip;
			} else {
				precipShow = precip * 0.0393701;
				let floor = 0.01;
				if (precipShow !== 0 && precipShow < floor) {
					precipShow = floor;
				}
			}

			const precision = (this.settings.unitMode.id === 'si') ? 1 : 2;
			const unit = (this.settings.unitMode.id === 'si') ? "mm" : "in";
			const offset = 0.12;
			const angle = ((i + hours) * 30) * deg2rad;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);
			this.ctxData.fillText(Helpers.floatToString(precipShow, precision), 0, -this.arcWidthInner * offset);
			this.ctxData.fillText(unit, 0, this.arcWidthInner * offset);
			this.ctxData.setTransform(...identity);
		}
	}

	drawWindData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(this.ctxData, colors, hours);
		}

		this.ctxData.fillStyle = this.colorTheme.text.data;

		const fontSize = this.arcWidthInner * 0.235;
		const fontSizeSmall = fontSize * 0.85;

		for (let i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const windDegree = weatherObject.WindDirection;
			const windRad = (windDegree) / 180 * Math.PI
			const windSpeed = weatherObject.WindSpeedMS;
			const windSpeedShow = (this.settings.unitMode.id === 'si') ? windSpeed : windSpeed * 2.23694;
			const symbol = (this.settings.unitMode.id === 'si') ? "m/s" : "mph";
			const angle = ((i + hours) * 30) * deg2rad;

			const l = this.arcWidthInner * 0.075;
			const g = 1.618;
			const h = l + g * l;
			const o = -0.87 * l;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius - this.arcWidthInner / 6);

			this.ctxData.rotate(-angle);
			this.ctxData.font = fontSize + "px " + this.fontFamily;
			this.ctxData.fillText(Helpers.floatToString(windSpeedShow, 0), 0, -this.arcWidthInner * 0.11);
			this.ctxData.font = fontSizeSmall + "px " + this.fontFamily;
			this.ctxData.fillText(symbol, 0, this.arcWidthInner * 0.11);

			this.ctxData.rotate(angle);
			this.ctxData.translate(0, this.arcWidthInner * 0.45);
			this.ctxData.rotate(-angle + windRad);

			if (windSpeed >= 0.5) {
				this.ctxData.beginPath();
				this.ctxData.moveTo(0, h + o);
				this.ctxData.lineTo(l, o);
				this.ctxData.lineTo(-l, o);
				this.ctxData.fill();
			} else {
				this.ctxData.beginPath();
				this.ctxData.arc(0, 0, l, 0, arc);
				this.ctxData.fill();
				this.ctxData.closePath();
			}

			this.ctxData.setTransform(...identity);
		}
	}

	drawHumidityData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(this.ctxData, colors, hours);
		}

		this.ctxData.fillStyle = this.colorTheme.text.data;
		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;

		for (let i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const humidity = weatherObject.Humidity;
			const angle = ((i + hours) * 30) * deg2rad;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);
			this.ctxData.fillText(Helpers.floatToString(humidity, 0) + "%", 0, 0);
			this.ctxData.setTransform(...identity);
		}
	}

	drawCloudData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(this.ctxData, colors, hours);
		}

		this.ctxData.fillStyle = this.colorTheme.text.data;
		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;

		for (let i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const cloudCover = weatherObject.TotalCloudCover;
			const angle = ((i + hours) * 30) * deg2rad;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);
			this.ctxData.fillText(Helpers.floatToString(cloudCover, 0) + "%", 0, 0);
			this.ctxData.setTransform(...identity);
		}
	}

	drawMoonData(weatherDataArray) {

		this.ctxData.fillStyle = 'white';
		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;

		const hours = this.date.getHours() + this.tzOffset;

		const targetSize = this.arcWidthInner;
		const size = Math.ceil(targetSize / 100) * 100;

		let moonCanvas = document.createElement('canvas');
		let moonPainter = new MoonPainter(moonCanvas, size);

		const brightUp = this.colorTheme.static.moon_bright_up;
		const brightDown = this.colorTheme.static.moon_bright_down;
		const dark = this.colorTheme.static.moon_dark;

		for (let i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const fraction = weatherObject.moonIllumination.fraction;
			const phase = weatherObject.moonIllumination.phase;
			const tilt = weatherObject.moonPosition.parallacticAngle;
			const limbAngle = weatherObject.moonIllumination.angle;
			const zenith = limbAngle - tilt;
			const altitude = weatherObject.moonPosition.altitude;
			const upColor = (altitude > 0) ? brightUp : brightDown;
			const angle = ((i + hours) * 30) * deg2rad;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);

			moonPainter.setColors(upColor, dark);
			moonPainter.paint(phase);

			this.ctxData.rotate(zenith);
			this.ctxData.drawImage(moonCanvas, -targetSize / 2, -targetSize / 2, targetSize, targetSize);
			this.ctxData.rotate(-zenith);

			this.ctxData.fillText(Helpers.floatToString(fraction * 100, 0) + "%", 0, 0);

			this.ctxData.setTransform(...identity);
		}
	}

	drawDataCircles(colors, hours) {

		for (let i = 0; i < 12; i++) {

			if (this.settings.gradientMode && !((i !== 0) ^ (i !== 11))) {
				continue;
			}

			const angle = ((i + hours) * 30) * deg2rad;

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.beginPath();
			this.ctxData.arc(0, 0, this.arcWidthInner / 2, 0, arc);
			this.ctxData.fillStyle = colors[i];
			this.ctxData.fill();
			this.ctxData.setTransform(...identity);
		}
	}

	divideGradient(colors, startAngle, endAngle) {

		const gradients = [];
		const n = colors.length;

		const delta = (endAngle - startAngle) / (n - 1);

		let angle1, angle2;
		let angleLast = startAngle;

		for (let i = 1; i < n; i++) {

			angle1 = angleLast;
			angle2 = angle1 + delta;
			angleLast = angle2;

			gradients.push({
				startAngle: angle1,
				endAngle: angle2,
				colors: [colors[i - 1], colors[i]],
				id: colors[i - 1].toString() + colors[i].toString()
			});
		}

		const nGradients = gradients.length;

		const gradientsMerged = [];
		let group = [];

		// Merge gradients with identical ids
		for (let i = 1; i < nGradients; i++) {

			group.push(gradients[i - 1]);

			const same = gradients[i].id === gradients[i - 1].id;

			if (!same || i === nGradients - 1) {
				gradientsMerged.push({
					startAngle: group[0].startAngle,
					endAngle: group[group.length - 1].endAngle,
					colors: group[0].colors,
					id: group[0].id
				});
				group = [];
			}
		}

		const nMerged = gradientsMerged.length;

		const lastGradient = gradients[nGradients - 1];
		const lastMerged = gradientsMerged[nMerged - 1];

		if (lastGradient.id === lastMerged.id) {
			gradientsMerged[nMerged - 1] = {
				startAngle: lastMerged.startAngle,
				endAngle: lastGradient.endAngle,
				colors: lastMerged.colors,
				id: lastMerged.id
			}
		} else {
			gradientsMerged.push({
				startAngle: lastMerged.endAngle,
				endAngle: lastGradient.endAngle,
				colors: lastGradient.colors,
				id: lastGradient.id
			});
		}

		if (gradientsMerged.length > 1) {
			for (let i = 0; i < gradientsMerged.length - 1; i++) {
				gradientsMerged[i].endAngle += 0.005;
			}
		}

		return gradientsMerged;
	}

	drawDataArcGradient(ctx, colors, hours) {
		const location = this.rimCenterRadius;
		const width = this.arcWidthInner / 2;
		const value = hours % 12;
		const valueDeg = value / 12 * 360;
		const startAngle = valueDeg * deg2rad - Math.PI / 2;
		const endAngle = startAngle + 330 * deg2rad;
		const gradients = this.divideGradient(colors, startAngle, endAngle);
		this.drawArcGradients(ctx, location, width, gradients);
	}

	drawArcGradients(ctxTarget, location, width, gradients) {

		let canvas = document.createElement('canvas');
		canvas.width = this.canvas.width;
		canvas.height = this.canvas.height;
		canvas.style.width = this.canvas.style.width;
		canvas.style.height = this.canvas.style.height;
		let ctx = canvas.getContext('2d');

		const widthExtra = 0.25 * this.unit;

		const nGradients = gradients.length;

		for (let i = 0; i < nGradients; i++) {

			const gradient = gradients[i];
			const gradientColors = gradient.colors;
			const nColors = gradientColors.length;
			const gradientStartAngle = gradient.startAngle;
			const gradientEndAngle = gradient.endAngle;

			const colorStops = [];
			for (let i = 0; i < nColors; i++) {
				colorStops.push({ offset: i / (nColors - 1), color: gradientColors[i]});
			}

			ctx.fillArcGradient(
				this.center.x,
				this.center.y,
				gradientStartAngle,
				gradientEndAngle,
				colorStops,
				location + (width + widthExtra),
				location - (width + widthExtra),
				{ resolutionFactor: 3 }
			);
		}

		ctx.lineWidth = 2 * widthExtra;
		ctx.strokeStyle = this.colorTheme.bg.dark;

		const startAngle = gradients[0].startAngle;
		const endAngle = gradients[nGradients - 1].endAngle;

		const o = (endAngle - startAngle !== arc) ? 0.05 : 0;

		ctx.globalCompositeOperation = "destination-out";

		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, location + (width + widthExtra), startAngle - o, endAngle + o);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, location - (width + widthExtra), startAngle - o, endAngle + o);
		ctx.stroke();

		ctxTarget.drawImage(canvas, 0, 0);
	}
}

import { Colors } from '../utils/colors';


export const availableUnitModes = [
	{ id: 'si', text: 'SI' },
	{ id: 'imperial', text: 'Imperial' }
];

export const dataTypes = [
	{
		id: 'temperature',
		key: 'Temperature',
		range: [-40, 40],
		colorFunction: Colors.getTemperatureColor,
		roundFunction: Math.round
	},
	{
		id: 'rain',
		key: 'Precipitation1h',
		range: [0.05, 12],
		colorFunction: Colors.getPrecipitationColor,
		roundFunction: (x) => {
			if (x < 0.05) {
				return 0;
			} else if (x < 1) {
				return 1;
			} else {
				return Math.round(x)
			}
		}
	},
	{
		id: 'wind',
		key: 'WindSpeedMS',
		range: [0, 27],
		colorFunction: Colors.getWindColor,
		roundFunction: Math.round
	},
	{
		id: 'humidity',
		key: 'Humidity',
		range: [0, 100],
		colorFunction: Colors.getHumidityColor,
		roundFunction: Math.round
	},
	{
		id: 'cloud',
		key: 'TotalCloudCover',
		range: [0, 100],
		colorFunction: Colors.getCloudColor,
		roundFunction: Math.round
	}
];

export const availableDataModes = [
	{
		id: 'weather',
		text: 'Weather',
		icon: 'sun'
	},
	{
		id: 'temperature',
		text: 'Temperature',
		icon: 'thermometer-half'
	},
	{
		id: 'rain',
		text: 'Rain',
		icon: 'tint'
	},
	{
		id: 'wind',
		text: 'Wind',
		icon: 'flag'
	},
	{
		id: 'humidity',
		text: 'Humidity',
		icon: 'bullseye'
	},
	{
		id: 'cloud',
		text: 'Cloud cover',
		icon: 'cloud'
	},
	{
		id: 'moon',
		text: 'Moon phase',
		icon: 'moon'
	}
];

export const availableClockSizes = [
	{
		id: 'small',
		text: 'Small',
		size: 7
	},
	{
		id: 'medium',
		text: 'Medium',
		size: 6.2
	},
	{
		id: 'large',
		text: 'Large',
		size: 5.5
	},
];

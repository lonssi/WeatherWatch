import store from '../store';
import { imagesReady } from '../actions/appActions';

let images = {};
let dispatched = false;

let imagesLoaded = function() {
	for (const key in images) {
		const imgObj = images[key];
		for (const imageKey in imgObj) {
			const img = imgObj[imageKey];
			if (!img.complete) {
				return false;
			}
		}
	}
	return true;
};

let loadImages = function() {
	const codes = [
		1,
		22,
		2,
		32,
		3,
		42,
		51,
		53,
		62,
		64,
		72,
		81,
		83,
		92,
		21,
		23,
		31,
		33,
		41,
		43,
		52,
		61,
		63,
		71,
		73,
		82,
		91
	];

	let handleImageChange = function() {
		if (imagesLoaded() && !dispatched) {
			dispatched = true;
			imagesReady()(store.dispatch);
		}
	};

	for (let i = 0; i < codes.length; i++) {
		const code = codes[i];

		const baseUrl = 'images/symbols/' + code;

		const urlDay = baseUrl + '.svg';
		let imageDay = new Image();
		imageDay.onload = handleImageChange;
		imageDay.onerror = handleImageChange;
		imageDay.src = urlDay;

		const urlNight = baseUrl + '_n.svg';
		let imageNight = new Image();
		imageNight.onload = handleImageChange;
		imageNight.onerror = handleImageChange;
		imageNight.src = urlNight;
		images[code] = {
			day: imageDay,
			night: imageNight
		};
	}
};

export const Images = {
	loadImages,
	images
};

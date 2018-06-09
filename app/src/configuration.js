
const devConfig = {
	WEATHER_API_URL: "http://localhost:8888/weather/"
};

const prodConfig = {
	WEATHER_API_URL: "https://api.weatherwatch.tech/weather/"
};

let loadConfiguration = function() {
	if (process.env.NODE_ENV === "development") {
		return devConfig;
	} else {
		return prodConfig;
	}
}

export default loadConfiguration();

import _ from 'lodash';
import { Constants } from './constants.js';

let clamp = function(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
};

export const Helpers = {
	clamp,

	/**
	 * Converts a floating point number to a string with a precision.
	 * Makes sure that the result can't be -0.
	 * @param  {Number} value - floating point number
	 * @param  {Number} precision - number of digits
	 * @return {String}
	 */
	floatToString: (value, precision) => {
		const str = value.toFixed(precision);
		if (Object.is(parseInt(str, 10), -0)) {
			return str.substring(1);
		} else {
			return str;
		}
	},

	/**
	 * Returns the amount of digits in a string that represents an integer
	 * @param  {String} value
	 * @return {Number}
	 */
	numberLength: value => {
		return Math.abs(parseInt(value, 10)).toString().length;
	},

	hideVirtualKeyboard: () => {
		if (
			document &&
			document.activeElement &&
			document.activeElement.blur &&
			typeof document.activeElement.blur === 'function'
		) {
			document.activeElement.blur();
		}
	},

	/**
	 * Attempts to convert a string to a boolean.
	 * If unsuccessful, null is returned.
	 * @param  {String} value
	 * @return {Boolean or null}
	 */
	toBoolean: value => {
		try {
			value = JSON.parse(value);
			if (_.isBoolean(value)) {
				return value;
			} else {
				return null;
			}
		} catch (e) {
			return null;
		}
	},

	/**
	 * Attempts to convert a string to a number.
	 * If unsuccessful, null is returned.
	 * @param  {String} value
	 * @return {Number or null}
	 */
	toNumber: value => {
		try {
			value = JSON.parse(value);
			if (_.isNumber(value)) {
				return value;
			} else {
				return null;
			}
		} catch (e) {
			return null;
		}
	},

	getClosestStartingHourDate: date => {
		return (
			date.getTime() -
			date.getMinutes() * Constants.minuteEpochs -
			date.getSeconds() * Constants.secondEpochs -
			date.getMilliseconds()
		);
	},

	dataIsOutdated: (data, strict) => {
		if (!data) {
			return true;
		}
		const diff = new Date() - data.time;
		const threshold = strict ? Constants.hourEpochs : 12 * Constants.hourEpochs;
		return diff >= threshold;
	},

	/**
	 * Map a value linearly from a range to another
	 * If the value exceeds the initial range it is clamped
	 * @param  {Number} value
	 * @param  {Array} srcRange - initial range
	 * @param  {Array} trgRange - target range
	 * @return {Number}
	 */
	remapValue: (value, srcRange, trgRange) => {
		value = clamp(value, srcRange[0], srcRange[1]);
		return (
			((value - srcRange[0]) / (srcRange[1] - srcRange[0])) *
				(trgRange[1] - trgRange[0]) +
			trgRange[0]
		);
	},

	/**
	 * Utility function for creating a new reducer state
	 * when a value (which as only certain valid values) changes.
	 * A matchFunction is used to find a matching valid value.
	 * If a match is found, it is inserted in the state.
	 * @param  {String} id - data type identifier
	 * @param  {String} key - data type key
	 * @param  {Function} matchFunction - function which returns a matching valid value for the id
	 * @param  {Object} state - initial reducer state
	 * @param  {Boolean} cache - Save the valid value to localStorage
	 * @return {Object} - new reducer state
	 */
	stateSelectUtil: (id, key, matchFunction, state, cache) => {
		const stateCopy = Object.assign({}, state, {});
		const obj = matchFunction(id);
		if (!_.isNull(obj)) {
			stateCopy[key] = obj;
			if (cache) {
				localStorage.setItem(key, id);
			}
		}
		return stateCopy;
	},

	/**
	 * Utility function for toggling boolean reducer state values
	 * @param  {String} key - data type key
	 * @param  {Object} state - initial reducer state
	 * @param  {Boolean} cache - Save the new value to localStorage
	 * @return {Object} - new reducer state
	 */
	stateToggleUtil: (key, state, cache) => {
		let value = !state[key];
		const stateCopy = Object.assign({}, state, {});
		stateCopy[key] = value;
		if (cache) {
			localStorage.setItem(key, value);
		}
		return stateCopy;
	}
};

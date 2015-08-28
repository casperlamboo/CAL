import {KeyLookUp} from '../core/utils.js';

export default class KeyListener {
	constructor (actions = {}, active = true) {
		this.visible = false;
		this.active = active;
		this.depth = -10000;

		this.actions = actions;
	}

	add (key, callback) {
		let keyCode;
		if (typeof key === 'number') {
			keyCode = key;
		}
		else if (typeof key === 'string') {
			keyCode = KeyLookUp.indexOf(key);
		}

		if (this.actions[keyCode] === undefined) {
			this.actions[keyCode] = [];
		}

		this.actions[keyCode].push(callback);

		return this;
	}

	keyDown ({keyCode}) {	
		if (this.actions[keyCode]) {
			let actions = this.actions[keyCode];

			for (let callback of actions) {
				callback();
			}
		}
	}
};

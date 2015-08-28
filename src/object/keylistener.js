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

	remove (...objects) {
		for (var key of objects) {
			if (typeof key === 'number') {
				delete this.actions[key];
			}
			else if (typeof key === 'string') {
				delete this.actions[KeyLookUp.indexOf(key)];
			}
			else if (typeof key === 'function') {
				for (let i of this.actions) {
					let action = this.actions[i];

					let index = action.indexOf(key);
					if (index !== -1) {
						action.splice(index, 1);
					}
				}
			}
		}

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

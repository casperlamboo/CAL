import {KeyLookUp} from '../core/utils.js';

export default class KeyListener {
	constructor (actions = {}, active = true) {
		this.visible = false;
		this.active = active;
		this.depth = -10000;

		this.actions = actions;
	}

	add (key, callback) {
		if (typeof key === 'number') {
			this.actions[key] = callback;
		}
		else if (typeof key === 'string') {
			key = KeyLookUp[key];
			this.actions[key] = callback;
		}

		return this;
	}

	keyDown (key) {	
		if (this.actions[key]) {
			this.actions[key]();
		}
	}
};

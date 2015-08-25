export default class KeyListener {
	
	constructor (actions = {}, active = true) {
		this.visible = false;
		this.active = active;
		this.depth = -10000;

		this.actions = actions;
	}

	add (key, callback) {
		this.actions[key] = callback;

		return this;
	}

	keyDown (key) {	
		if (this.actions[key]) {
			this.actions[key]();
		}
	}
	
};

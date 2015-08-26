export default class Loader {
	constructor (objects = []) {
		this.objects = objects;
	}
	
	add (...objects) {
		for (let i = 0; i < objects.length; i ++) {
			let object = objects[i];
			if (this.objects.indexOf(object) === -1) {
				this.objects.push(object);
			}
		}

		return this;
	}

	remove (...objects) {
		for (let i = 0; i < objects.length; i ++) {
			let object = objects[i];
			this.objects.remove(object);
		}

		return this;
	}

	load (callback) {
		let objectsToLoad = this.objects.length;
		for (let i = 0; i < this.objects.length; i ++) {
			let object = this.objects[i];
			object.load(() => {
				objectsToLoad -= 1;
				if (objectsToLoad === 0 && callback !== undefined) {
					callback();
				}
			}, this);
		};

		return this;
	}
};

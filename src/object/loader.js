export default class Loader {
	constructor (objects = []) {
		this.objects = objects;
	}
	
	add (...objects) {
		for (var i = 0; i < objects.length; i ++) {
			var object = objects[i];
			if (this.objects.indexOf(object) === -1) {
				this.objects.push(object);
			}
		}

		return this;
	}

	remove (...objects) {
		for (var i = 0; i < objects.length; i ++) {
			var object = objects[i];
			this.objects.remove(object);
		}

		return this;
	}

	load (callback) {
		var objectsToLoad = this.objects.length;
		for (var i = 0; i < this.objects.length; i ++) {
			var object = this.objects[i];
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
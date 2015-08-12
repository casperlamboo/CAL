export default class TimeLine {

	constructor ({autoRemove = true, loop = false}) {		
		this.visible = false;
		this.active = true;
		this.depth = -10000;

		this.moments = [];
		this.autoRemove = autoRemove;
		this.loop = loop;
		this.t = 0;
	}
	
	addMoment (time, callback) {
		this.moments.push({
			time: time,
			callback: callback
		});

		return this;
	}
	
	removeMoment (remove) {
		for (var i = 0; i < this.moments.length; i ++) {
			var moment = this.moments[i];

			if (moment === remove || moment.time === remove || moment.callback === remove) {
				this.moments.remove(moment);
			}
		}

		return this;
	}
	
	start () {
		this.t = 0;
		this.active = true;

		return this;
	}
	
	stop () {
		this.t = 0;
		this.active = false;

		return this;
	}
	
	pause () {
		this.active = false;

		return this;
	}
	
	resume () {
		this.active = true;

		return this;
	}
	
	step (dt) {
		var newTime = this.t + dt;
		var remove = true;

		for (var i = 0; i < this.moments.length; i ++) {
			var moment = this.moments[i];
			if (moment.time >= this.t) {
				if (moment.time < newTime) {
					moment.callback();
				}
				else {
					remove = false;
				}
			}
		}

		if (remove && this.loop) {
			this.t = 0;
		}
		else if (remove && this.autoRemove) {
			this.parent.remove(this);
		}

		this.t = newTime;
	}

};
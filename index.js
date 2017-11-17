'use strict';

const objHandler = {
	get: (target, name) => {
		if(target.has(name)) {
			return target.get(name);
		} else if(typeof target[name] === 'function') {
			if(DataObject.prototype[name] !== undefined) {
				return target[name].bind(target);
			} else {
				const f = target[name];

				return f.apply(new Proxy(target, objHandler));
			}
		}
	},
	set: (target, name, val) => {
		return target.set(name, val);
	},
	has: (target, name) => {
		return target.has(name);
	}
};

const events = {};

class DataObject {
	static create(data = {}) {
		const cls = this.prototype.constructor;
		const fargs = [null].concat(data);
		const obj = new (Function.prototype.bind.apply(cls, fargs));

		return new Proxy(obj, objHandler);
	}

	constructor(data = {}) {
		this._data = data;
		this._originalData = Object.assign({}, data);
	}

	set(a, b, c) {
		if(b !== undefined) {
			const oldValue = this._data[a];

			this._data[a] = b;
			if(c) this._originalData[a] = b;

			this.trigger('change:' + a, [oldValue, b]);
		} else {
			for(let k in a) {
				this.set(k. a[k], b)
			}
		}

		this.trigger('change');

		return true;
	}

	get(field, original) {
		let data = this._data;
		if(original) data = this._originalData;

		if(data[field] !== undefined) {
			return data[field];
		} else {
			return null;
		}
	}

	has(field) {
		return this._data[field] !== undefined;
	}

	undo() {
		for(let k in this._originalData) {
			this._data[k] = this._originalData[k];
		}
	}

	save() {
		this.trigger('save');
	}

	static on(type, fn) {
		const base = this.prototype.constructor.name;

		if(events[base] === undefined) events[base] = {};
		if(events[base][type] === undefined) events[base][type] = [];

		events[base][type].push(fn);
	}

	static remove(type, fn) {
		const base = this.prototype.constructor.name;

		if(events[base] !== undefined && events[base][type] !== undefined) {
			for(let k in events[base][type]) {
				if(events[base][type][k] === fn) {
					delete events[base][type][k];
					break;
				}
			}
		}
	}

	trigger(type, data = [], base = this.constructor.name) {
		if(events[base] !== undefined && events[base][type] !== undefined) {
			for(let f of events[base][type]) {
				if(typeof f === 'function') {
					f(...[].concat(new Proxy(this, objHandler)).concat(data));
				}
			}
		}

		if(base != 'DataObject') this.trigger(type, data, 'DataObject');
	}
}

module.exporst = DataObject;
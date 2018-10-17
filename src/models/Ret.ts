export interface IRet {
	state: 'ok' | 'fail';
	[key: string]: any;
}

export default class Ret {
	private target: Map<string, any> = new Map();

	private static STATE = 'state';
	private static STATE_OK = 'ok';
	private static STATE_FAIL = 'fail';

	set(key: string, value: any): Ret {
		this.target.set(key, value);
		return this;
	}

	get(key: string): any {
		return this.target.get(key);
	}

	remove(key: string): Ret {
		this.target.delete(key);
		return this;
	}

	setOk(): Ret {
		return this.set(Ret.STATE, Ret.STATE_OK);
	}

	setFail(): Ret {
		return this.set(Ret.STATE, Ret.STATE_FAIL);
	}

	get isOk(): boolean {
		return this.get(Ret.STATE) === Ret.STATE_OK;
	}

	get isFail(): boolean {
		return this.get(Ret.STATE) === Ret.STATE_FAIL;
	}

	static ok(): Ret {
		return new Ret().setOk();
	}

	static fail(): Ret {
		return new Ret().setFail();
	}

	static by(k: string, v: any): Ret {
		return new Ret().set(k, v);
	}
}

import { observable } from 'mobx';

export interface IRemind {
	// accountId:number;
	referMe: number;
	message: number;
	fans: number;
	comment: number;
	like: number;
	nay: number;
}

export default class Remind implements IRemind {
	//  @observable accountId: number = 0;
	@observable referMe: number = 0;
	@observable message: number = 0;
	@observable fans: number = 0;
	@observable comment: number = 0;
	@observable like: number = 0;
	@observable nay: number = 0;

	static from(remind: IRemind): Remind {
		const r = new Remind();
		for (let key in remind) {
			r[key] = remind[key];
		}
		return r;
	}
}

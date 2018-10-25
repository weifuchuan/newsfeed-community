import { observable, action } from 'mobx';
import { POST, GET, POST_FORM } from '@/kit/req';

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

	async fetch() {
		const remind: IRemind = (await GET('/remind')).data;
		this.merge(remind);
	}

	@action
	merge(remind: IRemind) {
		for (let key in remind) {
			this[key] = remind[key];
		}
	}

	@action
	clear = async()=> {
		this.referMe = 0;
		this.message = 0;
		this.fans = 0;
		this.comment = 0;
		this.like = 0;
		this.nay = 0;
		await GET('/remind/clear');
	}

	async del(type: keyof IRemind) {
		this[type] = 0;
		await POST_FORM('/remind/delete', { type });
	}

	static from(remind: IRemind): Remind {
		const r = new Remind();
		for (let key in remind) {
			r[key] = typeof remind[key] === 'number' ? remind[key] : 0;
		}
		return r;
	}
}

import { observable } from 'mobx';
import { POST_FORM } from '@/kit/req';
import Ret, { IRet } from './Ret';

export interface IAccount {
	id: number;
	username: string;
	password?: string;
	avatar: string;
}

export default class Account implements IAccount {
	@observable id: number = 0;
	@observable username: string = '';
	@observable password?: string | undefined;
	@observable avatar: string= '';

	static from(account: IAccount): Account {
		const acc = new Account();
		for (let key in account) {
			acc[key] = account[key];
		}
		return acc;
	}

	static async login(username: string, password: string): Promise<Ret> {
		const ret = (await POST_FORM<IRet>('/login', { username, password })).data;
		if (ret.state === 'ok') {
			return Ret.ok().set('account', Account.from(ret.account));
		} else {
			return Ret.fail().set('msg', ret.msg);
		}
	}
}

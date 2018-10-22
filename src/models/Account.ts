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
	@observable avatar: string = '';
	relations = new Map<number /* otherId */, number /* relation */>();

	// 关系 relation
	static NO_RELATION = 0; // 互相不关注
	static FANS = 1; // 粉丝
	static FOLLOW = 2; // 关注
	static FRIEND = 3; // 互相关注

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

	static async reg(username: string, password: string): Promise<Ret> {
		const ret = (await POST_FORM<IRet>('/reg', { username, password })).data;
		if (ret.state === 'ok') {
			return Ret.ok().set('account', Account.from(ret.account));
		} else {
			return Ret.fail().set('msg', ret.msg);
		}
	}

	static async getById(id: number, otherId?: number): Promise<Account> {
		const form = { id };
		otherId && (form['otherId'] = otherId);
		const ret: IRet = (await POST_FORM('/account', form)).data;
		if (ret.state === 'ok') {
			const account = Account.from(ret.account);
			ret.relation && account.relations.set(otherId!, ret.relation);
			return account;
		} else {
			throw ret.msg;
		}
	}
}

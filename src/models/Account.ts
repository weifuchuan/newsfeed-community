import { observable } from 'mobx';
import {  POST_FORM } from '@/kit/req';

export interface IAccount {
	id: number;
	username: string;
	password?: string;
	avatar: string;
}

export default class Account implements IAccount {
	@observable id: number;
	@observable username: string;
	@observable password?: string | undefined;
	@observable avatar: string;

	static from(account: IAccount): Account {
		const acc = new Account();
		for (let key in account) {
			acc[key] = account[key];
		}
		return acc;
	}

	static async login(username: string, password: string): Promise<Account> {
		return Account.from((await POST_FORM<IAccount>('/login', { username, password })).data);
	}
}

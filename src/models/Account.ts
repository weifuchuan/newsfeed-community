import { observable } from 'mobx';
import { POST_FORM } from '@/kit/req';
import Ret, { IRet } from './Ret';

export interface IAccount {
	id: number;
	username: string;
	password?: string;
	avatar: string;
}

export interface IFollowAccount {
	id: number;
	username: string;
	avatar: string;
	createAt: number;
}

export default class Account implements IAccount {
	// 关系 relation
	static readonly NO_RELATION = 0; // 互相不关注
	static readonly FANS = 1; // 粉丝
	static readonly FOLLOW = 2; // 关注
	static readonly FRIEND = 3; // 互相关注

	@observable id: number = 0;
	@observable username: string = '';
	@observable password?: string | undefined;
	@observable avatar: string = '';
	@observable relations = new Map<number /* otherId */, number /* relation */>();

	async changeAvatar(avatar: string) {
		const ret: IRet = (await POST_FORM('/account/changeAvatar', { avatar })).data;
		if (ret.state === 'ok') {
			this.avatar = avatar;
		} else {
			throw '更新失败';
		}
	}

	async changeUsername(username: string) {
		const ret: IRet = (await POST_FORM('/account/changeUsername', { username })).data;
		if (ret.state === 'ok') {
			this.username = username;
		} else {
			throw '更新失败';
		}
	}

	async changePassword(newPassword: string, oldPassword: string) {
		const ret: IRet = (await POST_FORM('/account/changePassword', { newPassword, oldPassword })).data;
		if (ret.state === 'ok') {
		} else {
			throw '更新失败';
		}
	}

	async follow(toId: number) {
		const ret: IRet = (await POST_FORM('/account/follow', { toId })).data;
		if (ret.state === 'ok') {
			let relation = Account.FOLLOW;
			if (this.relations.get(toId)) {
				const oldRelation = this.relations.get(toId)!;
				switch (oldRelation) {
					case Account.FANS:
						relation = Account.FRIEND;
						break;
				}
			}
			this.relations.set(toId, relation);
		} else {
			throw '更新失败';
		}
	}

	async unfollow(toId: number) {
		const ret: IRet = (await POST_FORM('/account/unfollow', { toId })).data;
		if (ret.state === 'ok') {
			let relation = Account.NO_RELATION;
			if (this.relations.get(toId)) {
				const oldRelation = this.relations.get(toId)!;
				switch (oldRelation) {
					case Account.FRIEND:
						relation = Account.FANS;
						break;
				}
			}
			this.relations.set(toId, relation);
		} else {
			throw '更新失败';
		}
	}

	async followList(): Promise<IFollowAccount[]> {
		const ret: IRet = (await POST_FORM('/account/followList', { id: this.id })).data;
		if (ret.state === 'ok') {
			return observable(ret.list);
		} else {
			throw 'error';
		}
	}

	async fansList(): Promise<IFollowAccount[]> {
		const ret: IRet = (await POST_FORM('/account/fansList', { id: this.id })).data;
		if (ret.state === 'ok') {
			return observable(ret.list);
		} else {
			throw 'error';
		}
	}

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
			ret.relation !== undefined && account.relations.set(otherId!, ret.relation);
			return account;
		} else {
			throw ret.msg;
		}
	}
}

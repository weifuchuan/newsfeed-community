import { observable } from 'mobx';
import { IRet } from './Ret';
import { POST_FORM } from '@/kit/req';

export const PUBLISH_POST = 0;
export const COMMENT_POST = 1;
export const FOLLOW_ACCOUNT = 2;
export const POST = 3;

export interface INewsfeed {
	id: number;
	accountId: number;
	refType: typeof PUBLISH_POST | typeof COMMENT_POST | typeof FOLLOW_ACCOUNT;
	refId: number;
	refParentType?: typeof POST;
	refParentId?: number;
	createAt: number;
	avatar: string;
	username: string;
	title?: string; // PUBLISH_POST COMMENT_POST
	toUsername?: string; // FOLLOW_ACCOUNT
	toAvatar?: string; // FOLLOW_ACCOUNT
	content?: string; // COMMENT_POST
}

export default class Newsfeed implements INewsfeed {
	@observable id: number = 0;
	@observable accountId: number = 0;
	@observable refType: 0 | 1 | 2 = 0;
	@observable refId: number = 0;
	@observable refParentType?: 3 | undefined;
	@observable refParentId?: number | undefined;
	@observable createAt: number = 0;
	@observable avatar: string = '';
	@observable username: string = '';
	@observable title?: string | undefined;
	@observable toUsername?: string | undefined;
	@observable toAvatar?: string | undefined;
	@observable content?: string | undefined;

	static from(newsfeed: INewsfeed): Newsfeed {
		const ns = new Newsfeed();
		for (let key in newsfeed) {
			ns[key] = newsfeed[key];
		}
		return ns;
	}

	static async paginate(
		accountId: number,
		pageNumber: number = 1
	): Promise<{
		newsfeeds: Newsfeed[];
		pageNumber: number;
		totalPage: number;
	}> {
		const ret: IRet = (await POST_FORM('/newsfeed', { accountId, p: pageNumber })).data;
		if (ret.state === 'ok') {
			const newsfeeds = ret.newsfeeds.map(Newsfeed.from);
			const pageNumber = ret.pageNumber;
			const totalPage = ret.totalPage;
			return {
				newsfeeds,
				pageNumber,
				totalPage
			};
		} else {
			throw 'fail';
		}
	}
}

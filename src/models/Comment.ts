import { observable } from 'mobx';
import { POST_FORM } from '@/kit/req';
import { IRet } from './Ret';
import Account from './Account';

export interface IComment {
	id: number;
	accountId: number;
	postId: number;
	refId?: number;
	content: string;
	createAt: number;
	username: string;
	avatar: string;
}

export default class Comment implements IComment {
	@observable id: number = 0;
	@observable accountId: number = 0;
	@observable postId: number = 0;
	@observable refId: number | undefined;
	@observable content: string = '';
	@observable createAt: number = 0;
	@observable username: string = '';
	@observable avatar: string = '';

	@observable children: Comment[] = [];

	static from(comment: IComment): Comment {
		const c = new Comment();
		for (let key in comment) {
			c[key] = comment[key];
		}
		return c;
	}

	static resolve(comments: IComment[]): Comment[] {
		const cs = comments.map(Comment.from);
		return Comment.fillChildren(cs);
	}

	static fillChildren(comments: Comment[], refId?: number): Comment[] {
		const res = comments.filter((c) => c.refId === refId);
		const stack = [ ...res ];
		for (; stack.length > 0; ) {
			const comment = stack.pop()!;
			comment.children = comments.filter((c) => c.refId === comment.id);
			stack.push(...comment.children);
		}
		return res;
	}

	static async add(
		content: string,
		postId: number,
		account: Account,
		createAt: number,
		refId?: number
	): Promise<Comment> {
		const form = { content, postId, accountId: account.id, createAt };
		refId && (form['refId'] = refId);
		const ret: IRet = (await POST_FORM('/post/comment', form)).data;
		if (ret.state === 'ok') {
			return Comment.from({
				content,
				postId,
				accountId: account.id,
				createAt,
				refId,
				id: ret.id,
				username: account.username,
				avatar: account.avatar
			});
		}
		throw ret.msg;
	}
}

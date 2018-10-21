import { observable, runInAction } from 'mobx';
import { POST_FORM, POST } from '@/kit/req';
import Ret, { IRet } from './Ret';
import Comment, { IComment } from './Comment';

export interface IPost {
	id: number;
	title: string;
	content: string;
	createAt: number;
	modifyAt?: number;
	likeCount: number;
	nayCount: number;

	accountId: number;
	username: string;
	avatar: string;

	like?: boolean;
	nay?: boolean;
}

export default class Post implements IPost {
	@observable id: number = 0;
	@observable title: string = '';
	@observable content: string = '';
	@observable createAt: number = 0;
	@observable modifyAt?: number | undefined;
	@observable likeCount: number = 0;
	@observable nayCount: number = 0;
	@observable accountId: number = 0;
	@observable username: string = '';
	@observable avatar: string = '';
	@observable like?: boolean;
	@observable nay?: boolean;

	@observable comments: Comment[] = [];

	async ILike(): Promise<Ret> {
		let ret: IRet;
		try {
			ret = (await POST_FORM('/post/like', { postId: this.id })).data;
		} catch (e) {
			console.error(e);
			ret = { state: 'fail', msg: e.toString() };
		}
		if (ret.state === 'ok') {
			runInAction(() => {
				if (this.like) {
					this.like = false;
					this.likeCount--;
				} else {
					this.like = true;
					this.likeCount++;
					if (this.nay) {
						this.nayCount--;
						this.nay = false;
					}
				}
			});
			return Ret.ok();
		} else {
			return Ret.fail().set('msg', ret.msg);
		}
	}

	async INay(): Promise<Ret> {
		let ret: IRet;
		try {
			ret = (await POST_FORM('/post/nay', { postId: this.id })).data;
		} catch (e) {
			console.error(e);
			ret = { state: 'fail', msg: e.toString() };
		}
		if (ret.state === 'ok') {
			runInAction(() => {
				if (this.nay) {
					this.nay = false;
					this.nayCount--;
				} else {
					this.nay = true;
					this.nayCount++;
					if (this.like) {
						this.likeCount--;
						this.like = false;
					}
				}
			});
			return Ret.ok();
		} else {
			return Ret.fail().set('msg', ret.msg);
		}
	}

	async fetchComments() { 
		const ret: IRet = (await POST_FORM('/post/getComments', { id: this.id })).data;
		if (ret.state === 'ok') {
			const comments: IComment[] = ret.comments;
			comments.sort((a, b) => (a.createAt < b.createAt ? -1 : a.createAt === b.createAt ? 0 : 1));
			this.comments = observable(Comment.resolve(comments));
		}
	}

	static from(post: IPost): Post {
		const p = new Post();
		for (let k in post) {
			p[k] = post[k];
		}
		return p;
	}

	static async getPostsByPaginate(
		p: number = 1
	): Promise<{
		posts: Post[];
		pageNumber: number;
		pageSize: number;
		totalPage: number;
	}> {
		const resp = await POST_FORM('/post', { p });
		return {
			posts: resp.data.posts.map(Post.from),
			pageNumber: resp.data.pageNumber,
			pageSize: resp.data.pageSize,
			totalPage: resp.data.totalPage
		};
	}

	static async add(title: string, content: string): Promise<Ret> {
		const ret: IRet = (await POST_FORM('/post/add', { title, content })).data;
		if (ret.state === 'ok') {
			return Ret.ok();
		} else {
			return Ret.fail().set('msg', ret.msg);
		}
	}

	static async getPost(id: number): Promise<Ret> {
		const ret: IRet = (await POST_FORM('/post/get', { id })).data;
		if (ret.state === 'ok') {
			const comments: IComment[] = ret.comments;
			delete ret.comments;
			const post = Post.from(ret.post);
			comments.sort((a, b) => (a.createAt < b.createAt ? -1 : a.createAt === b.createAt ? 0 : 1));
			post.comments = observable(Comment.resolve(comments));
			return Ret.ok().set('post', post);
		} else {
			return Ret.fail().set('msg', ret.msg);
		}
	}
}

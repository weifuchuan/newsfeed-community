import { observable } from 'mobx';
import { POST_FORM } from '@/kit/req';

export interface IPost {
	id: number;
	title: string;
	content: string;
	createAt: number;
	modifyAt?: number;
	likeCount: number;
	nayCount: number;
}

export default class Post implements IPost {
	@observable id: number=0;
	@observable title: string= '';
	@observable content: string= '';
	@observable createAt: number= 0;
	@observable modifyAt?: number | undefined;
	@observable likeCount: number= 0;
	@observable nayCount: number= 0;

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
}
 
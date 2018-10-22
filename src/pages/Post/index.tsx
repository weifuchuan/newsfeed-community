import React, { GetDerivedStateFromProps } from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import { observable, runInAction } from 'mobx';
import CommonLayout from '@/layouts/CommonLayout';
import { Button, Icon, Avatar, Spin, message, Input } from 'antd';
import { Link, Control } from 'react-keeper';
import moment from 'moment';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import CommentEditor from './CommentEditor';
import CommentItem from './CommentItem';
const { TextArea } = Input;
moment.locale('zh-cn');

interface Props {
	store: Store;
	params: {
		id: string;
	};
}

@inject('store')
@observer
export default class PostPage extends React.Component<Props, { self: PostPage }> {
	state = { self: this };
	realMounted = false;

	@observable post: Post = new Post();
	@observable loading = false;
	container: HTMLDivElement | null = null;
	commentsDiv: HTMLDivElement | null = null;

	render() {
		const post = this.post;

		return (
			<CommonLayout containerRef={(r) => (this.container = r)}>
				<div className="post" key={post.id}>
					<div>
						<div className="avatar" onClick={() => Control.go(`/user/${post.accountId}`)}>
							<Avatar src={post.avatar} shape="square" size="large" />
						</div>
						<div>
							<div onClick={() => Control.go(`/post/${post.id}`, { post })}>
								<span>{post.title}</span>
							</div>
							<div>
								<Link to={`/user/${post.accountId}`}>{post.username}</Link>
								<span>{moment(post.createAt).format('YYYY-MM-DD HH:mm')}</span>
							</div>
						</div>
					</div>
					<div>
						<div dangerouslySetInnerHTML={{ __html: post.content }} />
						<div onClick={() => Control.go(`/post/${post.id}`, { post })} />
					</div>
					<div>
						<div>
							<Icon
								type="caret-up"
								style={{
									marginBottom: '-0.2em',
									cursor: 'pointer',
									...post.like ? { color: 'blue' } : {}
								}}
								onClick={() => post.ILike()}
							/>
							<span>{post.likeCount - post.nayCount}</span>
							<Icon
								type="caret-down"
								style={{ cursor: 'pointer', ...post.nay ? { color: 'red' } : {} }}
								onClick={() => post.INay()}
							/>
						</div>
					</div>
				</div>
				<div className="comments" ref={(r) => (this.commentsDiv = r)}>
					<CommentEditor onComment={this.onComment} />
					{post.comments.map((c) => <CommentItem comment={c} key={c.id} />)}
				</div>
				<Spin
					spinning={this.loading}
					size={'large'}
					style={{ position: 'fixed', top: '50vh', left: '50vw', zIndex: 1000 }}
				/>
			</CommonLayout>
		);
	}

	onComment = async (content: string, elem: any) => {
		try {
			const comment = await Comment.add(content, this.post.id, this.props.store!.me!, new Date().getTime());
			this.post.comments.push(comment);
			elem.value = '';
		} catch (e) {
			console.error(e);
			message.error(e);
		}
	};

	componentDidMount() {
		this.fetchPost(Number.parseInt(this.props.params.id));
	}

	private async fetchPost(id: number) {
		this.loading = true;
		const i = this.props.store.posts.findIndex((p) => p.id === id);
		if (i !== -1) {
			this.post = this.props.store.posts[i];
			await this.post.fetchComments();
		} else {
			const ret = await Post.getPost(id);
			runInAction(() => {
				if (ret.isOk) {
					this.post = ret.get('post');
				} else {
					message.error(ret.get('msg'));
				}
			});
		}
		this.loading = false;
		this.realMounted = true;
		if (Control.state && Control.state.toCommentList)
			this.container &&
				this.container.scrollTo({
					top: this.commentsDiv!.getClientRects().item(0)!.top
				});
	}

	componentWillUnmount() {
		this.realMounted = false;
	}

	static getDerivedStateFromProps: GetDerivedStateFromProps<any, any> = (nextProps: any, state: any) => {
		if (nextProps.params.id) {
			const nextId = Number.parseInt(nextProps.params.id);
			if (state.self.realMounted && nextId !== state.self.post.id) {
				state.self.realMounted = false;
				state.self.fetchPost(nextId);
			}
		}
		return null;
	};
}

import { retryDo } from '@/kit/funcs';
import { POST, GET } from '@/kit/req';
import Post from '@/models/Post';
import { Store } from '@/store';
import { observable, runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import './index.scss';
import { Avatar, Button, Popover, Icon, Pagination, Spin } from 'antd';
import { Control, Link } from 'react-keeper';
import moment from 'moment';
import CommonLayout from '@/layouts/CommonLayout';

moment.locale('zh-cn');

interface Props {
	store: Store;
}

@inject('store')
@observer
export default class Home extends React.Component<Props> {
	@observable pageNumber = 1;
	@observable totalPage = 1;
	@observable loading = false;
	container: HTMLDivElement | null = null; 

	render() {
		return (
			<CommonLayout containerRef={(r) => (this.container = r)}>
				<div className={'posts'}>
					{this.props.store.posts.map((post) => {
						return (
							<div className="post" key={post.id}>
								<div>
									<div className="avatar" onClick={() => Control.go(`/user/${post.accountId}`)}>
										<Avatar src={post.avatar} shape="square" size="large" />
									</div>
									<div>
										<div onClick={() => Control.go(`/post/${post.id}` )}>
											<span>{post.title}</span>
										</div>
										<div>
											<Link to={`/user/${post.accountId}`}>{post.username}</Link>
											<span>{moment(post.createAt).format("YYYY-MM-DD HH:mm")}</span>
										</div>
									</div>
								</div>
								<div>
									<div dangerouslySetInnerHTML={{ __html: post.content }} />
									<div onClick={() => Control.go(`/post/${post.id}` )} />
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
									<div>
										<Button
											onClick={() =>
												Control.go(`/post/${post.id}`, { toCommentList: true })}
										>
											评论
										</Button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<Pagination
					showQuickJumper
					current={this.pageNumber}
					pageSize={1}
					total={this.totalPage}
					onChange={this.toPage}
				/>
				<div className={'operationBtns'}>
					<Button
						type="primary"
						shape="circle"
						icon="plus"
						size={'large'}
						onClick={() => Control.go('/edit-post/add')}
					/>
					<Button
						type="primary"
						shape="circle"
						icon="reload"
						size={'large'}
						onClick={() => this.toPage(1)}
						style={{ marginTop: '1em' }}
					/>
				</div>
				<Spin
					spinning={this.loading}
					size={'large'}
					style={{ position: 'fixed', top: '50vh', left: '50vw', zIndex: 1000 }}
				/>
			</CommonLayout>
		);
	}

	componentDidMount() {
		this.fetchInitDataFromServer();
		this.props.store.onAddPost(this.refresh); 
	} 

	componentWillUnmount(){
		this.props.store.offAddPost(this.refresh); 
	}

	private readonly fetchInitDataFromServer = async () => {
		this.loading = true;
		const ret = await retryDo(async () => (await POST('/home')).data, 3);
		runInAction(() => {
			this.props.store.posts = observable(ret.posts.map(Post.from));
			this.pageNumber = ret.pageNumber;
			this.totalPage = ret.totalPage;
			this.loading = false;
		});
	};

	toPage = async (pageNumber: number) => {
		this.loading = true;
		const ret = await Post.getPostsByPaginate(pageNumber);
		runInAction(() => {
			this.props.store.posts = observable(ret.posts);
			this.totalPage = ret.totalPage;
			this.pageNumber = ret.pageNumber;
			this.loading = false;
		});
		this.container && this.container.scrollTo({ top: 0 });
	};

	refresh = ()=>{
		this.toPage(1); 
	}
}

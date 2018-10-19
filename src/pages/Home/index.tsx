import { retryDo } from '@/kit/funcs';
import { POST, GET } from '@/kit/req';
import Post from '@/models/Post';
import { Store } from '@/store';
import { observable, runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import './index.scss';
import { Avatar, Button, Popover } from 'antd';
import { Control } from 'react-keeper';
import {List} from 'react-virtualized'

interface Props {
	store?: Store;
}

@inject('store')
@observer
export default class Home extends React.Component<Props> {
	@observable pageNumber = 0;
	@observable totalPage = 0;

	render() {
		return (
			<div className="HomeContainer">
				<div>
					<div className={'navbar'}>
						<div>
							<span>随便写的社区</span>
						</div>
						<div>
							<Popover
								placement="bottomRight"
								content={
									<div className={'my-operations'}>
										<div onClick={() => Control.go('/my')}>
											<span>我的主页</span>
										</div>
										<div onClick={() => Control.go('/message')}>
											<span>我的私信</span>
										</div>
										<div onClick={this.logout}>
											<span>退出登录</span>
										</div>
									</div>
								}
								trigger="click"
							>
								<Avatar
									className={'avatar'}
									shape="square"
									size="large"
									src={this.props.store!.me!.avatar}
								/>
							</Popover>
						</div>
					</div>
					<div className={"posts"} >
						
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.fetchInitDataFromServer();
	}

	private readonly fetchInitDataFromServer = async () => {
		const ret = await retryDo(async () => (await POST('/home')).data, 3);
		runInAction(() => {
			this.props.store!.posts = observable(ret.posts.map(Post.from));
			this.pageNumber = ret.pageNumber;
			this.totalPage = ret.totalPage;
		});
	};

	logout = async () => {
		await GET('/logout');
		window.location.reload(); 
	};
}

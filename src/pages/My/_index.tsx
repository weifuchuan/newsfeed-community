import React from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import CommonLayout from '@/layouts/CommonLayout';
import { observable, runInAction, toJS } from 'mobx';
import Newsfeed from '@/models/Newsfeed';
import { Spin, Pagination } from 'antd';
import NewsfeedItem from '@/components/NewsfeedItem';
import UserInfo from '@/components/UserInfo';

interface Props {
	store: Store;
}

@inject('store')
@observer
export default class My extends React.Component<Props> {
	@observable newsfeeds: Newsfeed[] = [];
	@observable pageNumber = 1;
	@observable totalPage = 1;
	@observable loading = false;
	container: HTMLDivElement | null = null;

	render() {
		return (
			<CommonLayout containerRef={(r) => (this.container = r)}>
				<UserInfo account={this.props.store.me!} />
				<div
					style={{
						padding: '1em',
						boxShadow: '0px 0px 0.5em #535353',
						backgroundColor: '#fff',
						borderRadius: '0.5em',
						margin: '0 0 1em',
						textAlign:"center"
					}}
				>
					<span style={{ fontSize: '1.5em' }}>我的动态</span>
				</div>
				{this.newsfeeds.map((ns) => {
					return <NewsfeedItem newsfeed={ns} key={ns.id} />;
				})}
				<Pagination
					showQuickJumper
					current={this.pageNumber}
					pageSize={1}
					total={this.totalPage}
					onChange={this.toPage}
				/>
				<Spin size="large" spinning={this.loading} style={{ position: 'fixed', left: '50vw', top: '50vh' }} />
			</CommonLayout>
		);
	}

	toPage = async (p: number) => {
		this.loading = true;
		let { newsfeeds, pageNumber, totalPage } = await Newsfeed.paginate(this.props.store.me!.id, p);
		runInAction(() => {
			this.newsfeeds = observable(newsfeeds);
			this.pageNumber = pageNumber;
			this.totalPage = totalPage;
			this.loading = false;
		});
		this.container && this.container.scrollTo({ top: 0 });
	};

	componentDidMount() {
		this.toPage(1);
	}
}

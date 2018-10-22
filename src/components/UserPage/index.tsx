import React, { GetDerivedStateFromProps } from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import CommonLayout from '@/layouts/CommonLayout';
import { observable, runInAction, toJS, autorun, IReactionDisposer } from 'mobx';
import Newsfeed from '@/models/Newsfeed';
import { Spin, Pagination } from 'antd';
import NewsfeedItem from '@/components/NewsfeedItem';
import UserInfo from '@/components/UserInfo';
import Account from '@/models/Account';
import { repeat } from '../../kit/funcs';

interface Props {
	store?: Store;
	account: Account;
}

@inject('store')
@observer
export default class UserPage extends React.Component<Props> {
	@observable newsfeeds: Newsfeed[] = [];
	@observable pageNumber = 1;
	@observable totalPage = 1;
	@observable loading = false;
	container: HTMLDivElement | null = null;
	lastAccountId = 0;

	render() {
		const account = this.props.account;
		return (
			<CommonLayout containerRef={(r) => (this.container = r)}>
				<UserInfo account={account} />
				<div
					style={{
						padding: '1em',
						boxShadow: '0px 0px 0.5em #535353',
						backgroundColor: '#fff',
						borderRadius: '0.5em',
						margin: '0 0 1em',
						textAlign: 'center'
					}}
				>
					<span style={{ fontSize: '1.5em' }}>
						{this.props.store!.me!.id === account.id ? '我' : account.username}的动态
					</span>
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
		let { newsfeeds, pageNumber, totalPage } = await Newsfeed.paginate(this.props.account.id, p);
		this.lastAccountId = this.props.account.id;
		runInAction(() => {
			this.newsfeeds = observable(newsfeeds);
			this.pageNumber = pageNumber;
			this.totalPage = totalPage;
			this.loading = false;
		});
		this.container && this.container.scrollTo({ top: 0 });
	};

	private closes: IReactionDisposer[] = [];

	componentDidMount() {
		this.closes.push(
			autorun(() => {
				if (this.props.account.id !== this.lastAccountId) {
					this.toPage(1);
				}
			})
		);
	}

	componentWillUnmount() {
		this.closes.forEach((c) => c());
	}
}

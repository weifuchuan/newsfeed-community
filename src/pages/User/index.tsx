import UserPage from '@/components/UserPage';
import { Store } from '@/store';
import { inject, observer } from 'mobx-react';
import React, { GetDerivedStateFromProps } from 'react';
import './index.scss';
import Account from '@/models/Account';
import { observable, runInAction } from 'mobx';
import { message } from 'antd';

interface Props {
	store: Store;
	params: {
		id: string;
	};
}

@inject('store')
@observer
export default class User extends React.Component<Props, { self: User }> {
	state = { self: this };
	realMounted = false;

	@observable account: Account = new Account();

	render() {
		return <UserPage account={this.account} />;
	}

	componentDidMount() {
		this.fetchById(Number.parseInt(this.props.params.id));
	}

	componentWillUnmount() {
		this.realMounted = false;
	}

	fetchById = async (id: number) => {
		try {
			const account = await Account.getById(id, this.props.store.me!.id);
			runInAction(() => {
				for (let key in account) {
					this.account[key] = account[key];
				}
			});
			this.realMounted = true;
		} catch (e) {
			message.error(e);
		}
	};

	static getDerivedStateFromProps: GetDerivedStateFromProps<any, any> = (nextProps: any, state: any) => {
		if (nextProps.params.id) {
			const nextId = Number.parseInt(nextProps.params.id);
			if (state.self.realMounted && nextId !== state.self.account.id) {
				state.self.realMounted = false;
				state.self.fetchById(nextId);
			}
		}
		return null;
	};
}

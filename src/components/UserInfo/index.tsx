import React from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import Newsfeed from '@/models/Newsfeed';
import moment from 'moment';
import { Avatar, Button } from 'antd';
import { PUBLISH_POST, FOLLOW_ACCOUNT, COMMENT_POST } from '@/models/Newsfeed';
import { Control } from 'react-keeper';
import Account from '@/models/Account';
moment.locale('zh-cn');

interface Props {
	store?: Store;
	account: Account;
}

@inject('store')
@observer
export default class UserInfo extends React.Component<Props> {
	render() {
		const a = this.props.account;
		let operations: React.ReactNode = null;
		let relation: React.ReactNode = null;
		if (a.id === this.props.store!.me!.id) {
			operations = (
				<div className="is-me">
					<Button onClick={this.changeAvatar}>修改头像</Button>
					<Button style={{ marginLeft: '0.5em' }} onClick={this.changeUsername}>
						修改昵称
					</Button>
					<Button style={{ marginLeft: '0.5em' }} onClick={this.changePassword}>
						修改密码
					</Button>
				</div>
			);
		} else {
			operations = (
				<div className="no-me">
					<Button onClick={this.clickFollow}>
						{a.relations.get(this.props.store!.me!.id) === Account.NO_RELATION ||
						a.relations.get(this.props.store!.me!.id) === Account.FOLLOW ? (
							'+关注'
						) : (
							'取消关注'
						)}
					</Button>
					<Button type="primary" style={{ marginLeft: '0.5em' }} onClick={this.sendMessage}>
						发私信
					</Button>
				</div>
			); 
			relation = (
				<span>
					{a.relations.get(this.props.store!.me!.id) === Account.NO_RELATION ? (
						''
					) : a.relations.get(this.props.store!.me!.id) === Account.FOLLOW ? (
						'(我的粉丝)'
					) : a.relations.get(this.props.store!.me!.id) === Account.FANS ? (
						'(我关注了)'
					) : a.relations.get(this.props.store!.me!.id) === Account.FRIEND ? (
						'(互相关注)'
					) : (
						''
					)}
				</span>
			);
		}

		return (
			<div className={'UserInfo'}>
				<div>
					<Avatar shape="square" size={84} src={a.avatar} />
				</div>
				<div>
					<div>
						<span style={{ fontSize: '2em' }}>{a.username}</span>
						{relation}
					</div>
					{operations}
				</div>
			</div>
		);
	}

	changeAvatar = () => {};
	changeUsername = () => {};
	changePassword = () => {};
	clickFollow = () => {};
	sendMessage = () => {};
}

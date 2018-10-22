import React from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import Newsfeed from '@/models/Newsfeed';
import moment from 'moment';
import { Avatar } from 'antd';
import { PUBLISH_POST, FOLLOW_ACCOUNT, COMMENT_POST } from '@/models/Newsfeed';
import { Control } from 'react-keeper';
moment.locale('zh-cn');

interface Props {
	store?: Store;
	newsfeed: Newsfeed;
}

@inject('store')
@observer
export default class NewsfeedItem extends React.Component<Props> {
	render() {
		const ns = this.props.newsfeed;
		let contentElem: React.ReactNode = null;
		let refElem: React.ReactNode = null;
		switch (ns.refType) {
			case PUBLISH_POST:
				contentElem = (
					<div>
						<b>发布帖子：</b>
					</div>
				);
				refElem = (
					<div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => Control.go(`/post/${ns.refId}`)}>
						<span>{ns.title!}</span>
					</div>
				);
				break;
			case FOLLOW_ACCOUNT:
				contentElem = (
					<div>
						<b>关注用户：</b>
					</div>
				);
				refElem = (
					<div
						className={'follow-account'}
						style={{ cursor: 'pointer', color: 'blue' }}
						onClick={() => Control.go(`/user/${ns.refId}`)}
					>
						<Avatar src={ns.toAvatar!} size={'small'} shape={'square'} />
						<span>{ns.toUsername!}</span>
					</div>
				);
				break;
			case COMMENT_POST:
				contentElem = (
					<div>
						<b>评论：</b>
						{ns.content}
					</div>
				);
				refElem = (
					<div
						style={{ cursor: 'pointer', color: 'blue' }}
						onClick={() => Control.go(`/post/${ns.refParentId}`)}
					>
						<span>{ns.title!}</span>
					</div>
				);
				break;
		}

		return (
			<div className={'NewsfeedItem'}>
				<div>
					<div
						onClick={() =>
							ns.accountId === this.props.store!.me!.id
								? Control.go('/my')
								: Control.go(`/user/${ns.accountId}`)}
					>
						<Avatar src={ns.avatar} size={'default'} shape={'square'} />
						<span style={{ marginLeft: '0.5em' }}>{ns.username}</span>
					</div>
					<span>{moment(ns.createAt).format('YYYY-MM-DD HH:mm')}</span>
				</div>
				<div>{contentElem}</div>
				<div>{refElem}</div>
			</div>
		);
	}
}

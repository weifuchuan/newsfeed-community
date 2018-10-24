import CommonLayout from '@/layouts/CommonLayout';
import Account from '@/models/Account';
import Message from '@/models/Message';
import { Store } from '@/store';
import { Avatar, Button, message, Spin, Pagination } from 'antd';
import { observable, runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import './index.scss';
import moment from 'moment';

moment.locale('zh-cn');

interface Props {
	store: Store;
	params: {
		id: string;
	};
}

@inject('store')
@observer
export default class SendMessage extends React.Component<Props> {
	@observable account = new Account();
	@observable loading: boolean = false;
	@observable messages: Message[] = [];
	@observable pageNumber = 1;
	@observable totalPage = 1;

	editor: HTMLDivElement | null = null;
	container: HTMLDivElement | null = null;

	render() {
		return (
			<CommonLayout containerRef={(r) => (this.container = r)}>
				<div className="SendMessageContainer">
					<h3 style={{ fontSize: '1.5em', textAlign: 'center', verticalAlign: 'center' }}>
						与&nbsp;<Avatar size={'default'} src={this.account.avatar} shape="square" />
						<span style={{ fontWeight: 'bold' }}>{this.account.username}</span>&nbsp;的私信
					</h3>
					<div style={{ borderTop: 'solid #aaa 1px', margin: '1em 0' }} />
					<div className={'msg-editor-panel'}>
						<div
							contentEditable={true}
							style={{ maxHeight: '10em', padding: '0.5em', border: 'solid 2px #aaa', overflow: 'auto' }}
							ref={(r) => (this.editor = r)}
						/>
						<Button onClick={this.send} type={'primary'}>
							发送
						</Button>
					</div>
					<div style={{ borderTop: 'solid #aaa 1px', margin: '1em 0' }} />
					<div>
						{this.messages.map((msg, i) => {
							return (
								<React.Fragment key={i}>
									<div className="item">
										<div>
											{msg.fromId === this.props.store.me!.id ? (
												<div>
													<Avatar
														size={'default'}
														src={this.props.store.me!.avatar}
														shape="square"
													/>
													<span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
														{this.props.store.me!.username}
													</span>
												</div>
											) : (
												<div>
													<Avatar size={'default'} src={this.account.avatar} shape="square" />
													<span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
														{this.account.username}
													</span>
												</div>
											)}
											<span>{moment(msg.createAt).format('YYYY-MM-DD HH:mm')}</span>
										</div>
										<div
											style={{ fontSize: '1.5em' }}
											dangerouslySetInnerHTML={{ __html: msg.content }}
										/>
									</div>
									{i === this.messages.length - 1 ? null : (
										<div style={{ borderTop: 'solid #aaa 1px', margin: '1em 0' }} />
									)}
								</React.Fragment>
							);
						})}
					</div>
					<div style={{ borderTop: 'solid #aaa 1px', margin: '1em 0' }} />
					{this.totalPage < 2 ? null : (
						<Pagination
							showQuickJumper
							current={this.pageNumber}
							pageSize={1}
							total={this.totalPage}
							onChange={this.toPage}
						/>
					)}
				</div>
				<Spin
					spinning={this.loading}
					size={'large'}
					style={{ position: 'fixed', top: '50vh', left: '50vw', zIndex: 1000 }}
				/>
				<div className={'operationBtns'}>
					<Button type="primary" shape="circle" icon="reload" size={'large'} onClick={() => this.toPage(1)} />
				</div>
			</CommonLayout>
		);
	}

	send = async () => {
		const content = this.editor!.innerHTML;
		if (content.trim() === '') {
			return;
		}
		this.loading = true;
		const createAt = new Date().getTime();
		const ret = await Message.send(this.account.id, content, createAt);
		if (ret.isOk) {
			const msg = new Message();
			msg.id = ret.get('id');
			msg.content = content;
			msg.fromId = this.props.store.me!.id;
			msg.toId = this.account.id;
			msg.createAt = createAt;
			this.messages.unshift(msg);
			this.editor!.innerHTML = '';
			message.success('发送成功');
		} else {
			message.error('发送失败');
		}
		this.loading = false;
	};

	toPage = async (p: number) => {
		this.loading = true;
		const { messages, pageNumber, totalPage } = await Message.paginate(this.account.id, p);
		runInAction(() => {
			this.messages = observable(messages);
			this.pageNumber = pageNumber;
			this.totalPage = totalPage;
			this.loading = false;
		});
		this.container!.scrollTo({ top: 0 });
	};

	componentDidMount() {
		this.fetchById(Number.parseInt(this.props.params.id))
			.then(async () => {
				await this.toPage(1);
			})
			.catch((e) => message.error(e));
	}

	fetchById = async (id: number) => {
		this.loading = true;
		this.account = await Account.getById(id);
		this.loading = false;
	};
}

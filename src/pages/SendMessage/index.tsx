import CommonLayout from '@/layouts/CommonLayout';
import Account from '@/models/Account';
import Message from '@/models/Message';
import { Store } from '@/store';
import { Avatar, Button, message, Spin, Pagination } from 'antd';
import { observable, runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import './index.scss';

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

	render() {
		return (
			<CommonLayout>
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
					<div />
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
		console.log(this.editor!.innerHTML);
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

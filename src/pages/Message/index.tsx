import React from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import CommonLayout from '@/layouts/CommonLayout';
import { Button, Spin, Avatar } from 'antd';
import { observable, runInAction } from 'mobx';
import Message from '@/models/Message';
import moment from 'moment';
import { Control } from 'react-keeper';

moment.locale('zh-cn');

interface Props {
	store: Store;
}

@inject('store')
@observer
export default class MessagePage extends React.Component<Props> {
	container: HTMLDivElement | null = null;

	@observable messages: Message[] = [];
	@observable loading = false;

	render() {
		return (
			<CommonLayout containerRef={(r) => (this.container = r)}>
				<div className="MessageContainer">
					<h3 style={{ fontSize: '1.5em', textAlign: 'center', verticalAlign: 'center' }}>我的私信列表</h3>
					<div style={{ borderTop: 'solid #aaa 1px', margin: '1em 0' }} />
					{this.messages.map((msg, i) => {
						return (
							<React.Fragment key={i}>
								<div
									className="item"
									onClick={() =>
										Control.go(
											`/send-message/${msg.fromId === this.props.store.me!.id
												? msg.toId
												: msg.fromId}`
										)}
								>
									<div>
										<div>
											<Avatar size={'default'} src={msg.avatar} shape="square" />
											<span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
												{msg.username}
											</span>
										</div>
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
					<div style={{ borderTop: 'solid #aaa 1px', margin: '1em 0' }} />
				</div>
				<div className={'operationBtns'}>
					<Button type="primary" shape="circle" icon="reload" size={'large'} onClick={this.fetch} />
				</div>
				<Spin
					spinning={this.loading}
					size={'large'}
					style={{ position: 'fixed', top: '50vh', left: '50vw', zIndex: 1000 }}
				/>
			</CommonLayout>
		);
	}

	fetch = async () => {
		this.loading = true;
		const messages = observable((await Message.list()).get('list'));
		runInAction(() => {
			this.loading = false;
			this.messages = messages;
    });
    this.container!.scrollTo({ top: 0 });
	};

	componentDidMount() {
		this.fetch();
	}
}

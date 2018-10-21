import { GET } from '@/kit/req';
import { Store } from '@/store';
import { Avatar, Popover } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Control } from 'react-keeper';
import './index.scss';
import { observable } from 'mobx';

interface Props {
	store?: Store;
	containerRef?: (div: HTMLDivElement | null) => void;
}

@inject('store')
@observer
export default class CommonLayout extends React.Component<Props> {
	@observable visible = false;

	render() {
		return (
			<div className="Container" ref={this.props.containerRef}>
				<div>
					<div className={'navbar'}>
						<div>
							<span onClick={() => Control.go('/')}>随便写的社区</span>
						</div>
						<div>
							<Popover
								placement="bottomRight"
								title={<span style={{ padding: '0.5em' }}>{this.props.store!.me!.username}</span>}
								content={
									<div className={'my-operations'}>
										<div onClick={() => (Control.go('/my'), (this.visible = false))}>
											<span>我的主页</span>
										</div>
										<div onClick={() => (Control.go('/message'), (this.visible = false))}>
											<span>我的私信</span>
										</div>
										<div onClick={this.logout}>
											<span>退出登录</span>
										</div>
									</div>
								}
								trigger="click"
								visible={this.visible}
								onVisibleChange={(v) => (this.visible = v)}
							>
								<div onClick={() => (this.visible = true)}>
									<Avatar
										className={'avatar'}
										shape="square"
										size="large"
										src={this.props.store!.me!.avatar}
									/>
								</div>
							</Popover>
						</div>
					</div>
					{this.props.children}
				</div>
			</div>
		);
	}

	logout = async () => {
		await GET('/logout');
		window.location.reload();
	};
}

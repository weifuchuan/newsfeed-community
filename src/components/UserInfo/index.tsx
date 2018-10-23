import Account from '@/models/Account';
import { Store } from '@/store';
import { Avatar, Button, message, Input } from 'antd';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import Modal from '../Modal/index';
import './index.scss';
import { Control } from 'react-keeper';
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

	changeAvatar = async () => {
		const me = this.props.store!.me!;
		const store = this.props.store!;

		const ModalPanel = class extends React.Component {
			fileInput: HTMLInputElement | null = null;
			state = { avatar: '', loading: false };

			render() {
				return (
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							padding: '1em',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<img
							style={{ backgroundColor: '#EAEAEF', width: '200px', height: '200px' }}
							src={this.state.avatar}
						/>
						<Button
							style={{ marginTop: '1em' }}
							disabled={this.state.loading}
							onClick={() => {
								this.fileInput!.dispatchEvent(
									new MouseEvent('click', {
										bubbles: false,
										cancelable: true,
										view: window
									})
								);
							}}
						>
							选择图片
						</Button>
						<Button
							type="primary"
							style={{ marginTop: '1em' }}
							disabled={this.state.avatar === ''}
							onClick={async () => {
								this.setState({ loading: true });
								try {
									await me.changeAvatar(this.state.avatar);
									store.emitUpdateMyNewsfeed();
									close();
								} catch (e) {
									message.error('上传失败');
								}
								this.setState({ loading: false });
							}}
							loading={this.state.loading}
						>
							上传新头像
						</Button>
						<input
							type="file"
							style={{ visibility: 'hidden' }}
							accept="image/*"
							ref={(r) => (this.fileInput = r)}
							onChange={(e) => {
								const files: FileList = this.fileInput!.files!;
								if (files && files.length > 0) {
									const image = files.item(0)!;
									const reader = new FileReader();
									reader.onloadend = () => {
										this.setState({ avatar: (reader.result as any).toString() });
									};
									reader.readAsDataURL(image);
								}
							}}
						/>
					</div>
				);
			}
		};

		const close = Modal.show(<ModalPanel />, '70vw', '80vh');
	};

	changeUsername = () => {
		const me = this.props.store!.me!;
		const store = this.props.store!;

		const ModalPanel = class extends React.Component {
			state = { username: '', loading: false };

			render() {
				return (
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							padding: '1em',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Input
							value={this.state.username}
							placeholder={'新昵称'}
							onChange={(e: any) => this.setState({ username: e.target.value.replace(/\s/, '-') })}
						/>
						<Button
							type="primary"
							style={{ marginTop: '1em' }}
							disabled={this.state.username.trim() === ''}
							onClick={async () => {
								this.setState({ loading: true });
								try {
									await me.changeUsername(this.state.username);
									store.emitUpdateMyNewsfeed();
									close();
								} catch (e) {
									message.error('更新失败');
								}
								this.setState({ loading: false });
							}}
							loading={this.state.loading}
						>
							更新昵称
						</Button>
					</div>
				);
			}
		};

		const close = Modal.show(<ModalPanel />, '70vw', '80vh');
	};

	changePassword = () => {
		const me = this.props.store!.me!;
		const store = this.props.store!;

		const ModalPanel = observer(
			class extends React.Component {
				state = { newPassword: '', oldPassword: '', loading: false };

				render() {
					return (
						<div
							style={{
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								padding: '1em',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<Input
								value={this.state.oldPassword}
								placeholder={'原密码'}
								onChange={(e: any) => this.setState({ oldPassword: e.target.value.trim() })}
							/>
							<Input
								value={this.state.newPassword}
								style={{ marginTop: '1em' }}
								placeholder={'新密码'}
								onChange={(e: any) => this.setState({ newPassword: e.target.value.trim() })}
							/>
							<Button
								type="primary"
								style={{ marginTop: '1em' }}
								disabled={this.state.oldPassword.trim() === '' || this.state.oldPassword.trim() === ''}
								onClick={async () => {
									this.setState({ loading: true });
									try {
										await me.changePassword(this.state.newPassword, this.state.oldPassword);
										close();
									} catch (e) {
										message.error('更新失败');
									}
									this.setState({ loading: false });
								}}
								loading={this.state.loading}
							>
								更新密码
							</Button>
						</div>
					);
				}
			}
		);

		const close = Modal.show(<ModalPanel />, '70vw', '80vh');
	};
	clickFollow = async () => {
		const a = this.props.account;
		const me = this.props.store!.me!;
		if (
			a.relations.get(this.props.store!.me!.id) === Account.NO_RELATION ||
			a.relations.get(this.props.store!.me!.id) === Account.FOLLOW
		) {
			try {
				await me.follow(a.id);
				if (a.relations.get(this.props.store!.me!.id) === Account.FOLLOW) {
					a.relations.set(this.props.store!.me!.id, Account.FRIEND);
				} else {
					a.relations.set(this.props.store!.me!.id, Account.FANS);
				}
			} catch (e) {
				message.error('关注失败');
			}
		} else {
			try {
				await me.unfollow(a.id);
				if (a.relations.get(this.props.store!.me!.id) === Account.FRIEND) {
					a.relations.set(this.props.store!.me!.id, Account.FANS);
				} else {
					a.relations.set(this.props.store!.me!.id, Account.NO_RELATION);
				}
			} catch (e) {
				message.error('关注失败');
			}
		}
	};
	sendMessage = () => {
		Control.go(`/send-message/${this.props.account.id}`);
	};
}

import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import bgimg from '@/assets/image/login-reg-backgroud';
import { Form, Input, Button, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import './index.less';
import { Control } from 'react-keeper';
import Account from '@/models/Account';
import { toJS } from 'mobx';

interface LoginProps {
	store: Store;
}

@inject('store')
@observer
export default class Login extends React.Component<LoginProps> {
	render() {
		return (
			<div
				style={{
					flex: 1,
					flexDirection: 'row'
				}}
				className="flex"
			>
				<div
					style={{
						backgroundImage: `url(${bgimg})`,
						height: '100%',
						width: '128px',
						backgroundSize: '100% 100%'
					}}
					className="flex"
				/>
				<div className="flex" style={{ flex: 1, marginLeft: '1em', justifyContent: 'center' }}>
					<div style={{ fontSize: '2em', marginBottom: '1em' }}>登录</div>
					<LoginForm onLogin={this.onLogin} />
				</div>
			</div>
		);
	}

	private readonly onLogin = async ({ loginer, password }: { loginer: string; password: string }) => {
		try {
			const ret = await Account.login(loginer, password);
			if (ret.isOk) {
				const account = ret.get('account');
				this.props.store.me = account;
				Control.go(Control.state.backUri ? Control.state.backUri : '/');
			} else {
				message.error(ret.get('msg'), 3);
			}
		} catch (e) {
			message.error(e.toString());
		}
	};
}

const FormItem = Form.Item;

class _LoginForm extends React.Component<
	FormComponentProps & {
		onLogin: (values: any) => void;
	}
> {
	handleSubmit = (e: any) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.onLogin(values);
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<FormItem>
					{getFieldDecorator('loginer', {
						rules: [ { required: true, message: '请输入用户名或邮箱' } ]
					})(
						<Input
							prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="用户名/邮箱"
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [ { required: true, message: '请输入密码' } ]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							placeholder="密码"
						/>
					)}
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit" className="login-form-button">
						登录
					</Button>
					Or <a onClick={() => Control.go('/reg', Control.state)}>立即注册</a>
				</FormItem>
			</Form>
		);
	}
}

const LoginForm = Form.create()(_LoginForm);

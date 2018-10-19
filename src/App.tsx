import * as React from 'react';
import './App.scss';
import { HashRouter, Route, Filter, Control } from 'react-keeper';
import { Spin, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { retryDo, repeat } from '@/kit/funcs';
import { POST } from '@/kit/req';
import { IRet } from './models/Ret';
import { Store } from './store/index';
import Account from './models/Account';
import Ret from './models/Ret';

const Router = HashRouter;

@inject('store')
@observer
class App extends React.Component<{ store?: Store }> {
	@observable isLogged: 0 | 1 | 2 = 0; // 0: asking, 1: logged, 2: unlogged

	render() {
		return (
			<Router>
				<div className={'container'}>
					<Spin
						size="large"
						spinning={this.isLogged === 0}
						style={{ position: 'fixed', left: '50vw', top: '50vh' }}
					/>
					<Route
						path={'/>'}
						loadComponent={(cb) => import('@/pages/Home').then((C) => cb(C.default))}
						enterFilter={[ this.loggedFilter ]}
					/>
					<Route
						path={'/login>'}
						loadComponent={(cb) => import('@/pages/Login').then((C) => cb(C.default))}
						enterFilter={[ this.unloggedFilter ]}
					/>
					<Route
						path={'/reg>'}
						loadComponent={(cb) => import('@/pages/Reg/index').then((C) => cb(C.default))}
						enterFilter={[ this.unloggedFilter ]}
					/>
					<Route
						path={'/my>'}
						loadComponent={(cb) => import('@/pages/My').then((C) => cb(C.default))}
						enterFilter={[ this.loggedFilter ]}
					/>
					<Route
						path={'/user>'}
						loadComponent={(cb) => import('@/pages/User').then((C) => cb(C.default))}
						enterFilter={[ this.loggedFilter ]}
					/>
					<Route
						path={'/message>'}
						loadComponent={(cb) => import('@/pages/Message').then((C) => cb(C.default))}
						enterFilter={[ this.loggedFilter ]}
					/>
					<Route miss loadComponent={(cb) => import('@/pages/C404').then((C) => cb(C.default))} />
				</div>
			</Router>
		);
	}

	componentDidMount() {
		(async () => {
			this.isLogged = 0;
			let ret: IRet;
			try {
				ret = await retryDo(async () => {
					const ret: IRet = (await POST('/login/isLogged')).data;
					return ret;
				}, 3);
			} catch (e) {
				ret = { state: 'fail', msg: e.toString() };
			}
			if (ret.state === 'ok') {
				this.isLogged = 1;
				this.props.store!.me = Account.from(ret.account);
			} else {
				this.isLogged = 2;
				if (ret.msg) {
					message.error(ret.msg);
				}
			}
		})();
	}

	// 未登录者通过
	private readonly unloggedFilter: Filter = async (cb, props) => {
		repeat(() => {
			if (this.isLogged === 0) {
				return false;
			} else {
				if (this.isLogged === 2 && !this.props.store!.me) {
					cb();
				} else {
					Control.go('/');
				}
				return true;
			}
		}, 100);
	};

	// 已登录者通过
	private readonly loggedFilter: Filter = async (cb, props) => {
		repeat(() => {
			if (this.isLogged === 0) {
				return false;
			} else {
				if (this.isLogged === 1 || this.props.store!.me) {
					cb();
				} else {
					Control.go('/login');
				}
				return true;
			}
		}, 100);
	};
}

export default App;

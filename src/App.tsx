import * as React from 'react';
import './App.scss';
import { HashRouter, Route } from 'react-keeper';

const Router = HashRouter;

class App extends React.Component {
	render() {
		return (
			<Router>
				<div className={'container'}>
					<Route path={'/>'} loadComponent={(cb) => import('@/pages/Home').then((C) => cb(C.default))} />
					<Route
						path={'/login>'}
						loadComponent={(cb) => import('@/pages/Login').then((C) => cb(C.default))}
					/>
					<Route path={'/reg>'} loadComponent={(cb) => import('@/pages/Reg').then((C) => cb(C.default))} />
					<Route path={'/my>'} loadComponent={(cb) => import('@/pages/My').then((C) => cb(C.default))} />
					<Route path={'/user>'} loadComponent={(cb) => import('@/pages/User').then((C) => cb(C.default))} />
					<Route miss loadComponent={(cb) => import('@/pages/C404').then((C) => cb(C.default))}  />
				</div>
			</Router>
		);
	}
}

export default App;

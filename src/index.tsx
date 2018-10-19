import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './App';
import { Provider } from 'mobx-react';
import store from '@/store';
import './index.scss';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';

ReactDOM.render(
	<Provider store={store}>
		<LocaleProvider locale={zhCN}>
			<App />
		</LocaleProvider>
	</Provider>,
	document.getElementById('root')
);

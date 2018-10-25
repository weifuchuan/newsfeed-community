import React from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import Remind from '@/models/Remind';
import { observable, computed } from 'mobx';
import Transition from 'react-transition-group/Transition';
import { Icon } from 'antd';
import { Control } from 'react-keeper';

interface Props {
	store?: Store;
}

@inject('store')
@observer
export default class RemindBox extends React.Component<Props> {
	@observable remind = new Remind();
	@computed
	get remindList(): [string, () => void][] {
		const res: [string, () => void][] = [];
		for (let key in this.remind) {
			if (this.remind[key] > 0) {
				switch (key) {
					case 'referMe':
						break;
					case 'message':
						res.push([
							`${this.remind[key]}条私信`,
							() => {
								Control.go(`/message`);
								this.remind.del("message");
							}
						]);
						break;
					case 'fans':
						break;
					case 'comment':
						res.push([
							`${this.remind[key]}个回复`,
							() => {
								Control.go(`/my`);
								this.remind.del("comment");
							}
						]);
						break;
					case 'like':
						break;
					case 'nay':
						break;
					default:
						break;
				}
			}
		}
		return res;
	}

	render() {
		return (
			<div>
				{this.remindList.length === 0 ? null : (
					<div className="RemindBoxContainer">
						{this.remindList.map((r, i) => {
							return (
								<div onClick={r[1]} key={i}>
									{r[0]}
								</div>
							);
						})}
						<div onClick={this.remind.clear}>我知道了</div>
					</div>
				)}
			</div>
		);
	}

	timer?: NodeJS.Timeout;

	componentDidMount() {
		this.remind.fetch();
		// if (!__DEV__)
			this.timer = setInterval(() => {
				this.remind.fetch();
			}, 10 * 1000);
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}
}

import React from 'react';
import { Alert, Button } from 'antd';
import { Control } from 'react-keeper';
import './index.scss'

export default class C404 extends React.Component {
	render() {
		return (
			<div className={"C404Container"}>
				<Alert
					message="404 Not Found"
					description={
						<Button
							onClick={() => {								
								Control.go('/');
							}}
						>
							返回首页
						</Button>
					}
					type="warning"
					showIcon
				/>
			</div>
		);
	}
}

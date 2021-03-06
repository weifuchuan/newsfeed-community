import { Button, Input } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import './index.scss'; 

@observer
export default class CommentEditor extends React.Component<{
	onComment: (content: string, elem: any) => void;
	style?: CSSProperties;
}> {
	@observable content = '';
	editor: any;

	render() {
		return (
			<div className="comment-editor" style={this.props.style}>
				<Input
					placeholder="评论..."				
					style={{ flex: 1, marginRight: '0.5em' }}
					onChange={(e: any) => ((this.content = e.target.value), (this.editor = e.target))}
				/>
				<Button
					type="primary"
					onClick={() => this.props.onComment(this.content, this.editor)}
					disabled={this.content.trim() === ''}
				>
					评论
				</Button>
			</div>
		);
	}
}

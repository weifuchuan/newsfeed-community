import React from 'react';
import { observer, inject } from 'mobx-react';
import Comment from '@/models/Comment';
import './index.scss';
import { Avatar, message } from 'antd';
import moment from 'moment';
import { observable } from 'mobx';
import CommentEditor from './CommentEditor';
import { Store } from '@/store';
moment.locale('zh-cn');

@inject('store')
@observer
export default class CommentItem extends React.Component<{
	store?: Store;
	comment: Comment;
}> {
	@observable openEditor = false;

	render() {
		return (
			<div className={'comment'}>
				<div>
					<div>
						<Avatar src={this.props.comment.avatar} size={'small'} shape={'square'} />
					</div>
					<div>
						<span>{this.props.comment.username}</span>
					</div>
				</div>
				<div>
					<p>{this.props.comment.content}</p>
				</div>
				<div>
					<div>
						<button onClick={() => (this.openEditor = !this.openEditor)}>评论</button>
					</div>
					<div>
						<span>{moment(this.props.comment.createAt).format('YYYY-MM-DD HH:mm')}</span>
					</div>
				</div>
				{this.openEditor ? <CommentEditor onComment={this.onComment} style={{ marginTop: '0.5em' }} /> : null}
				{this.props.comment.children.map((comment) => <CommentItem comment={comment} key={comment.id} />)}
			</div>
		);
	}

	onComment = async (content: string, elem: any) => {
		try {
			const comment = await Comment.add(
				content,
				this.props.comment.postId,
				this.props.store!.me!,
        new Date().getTime(),
        this.props.comment.id
			);
      this.props.comment.children.push(comment);
      elem.value = ''; 
		} catch (e) {
			console.error(e);
			message.error(e);
		}
	};
}

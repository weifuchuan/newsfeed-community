import React, { StyleHTMLAttributes } from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import CommonLayout from '@/layouts/CommonLayout/index';
import { observable } from 'mobx';
import { Input, Button, message } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import Post from '@/models/Post';
import { IRet } from '@/models/Ret';
import { Control } from 'react-keeper';

interface Props {
	store: Store;
	params: {
		action: 'add' | 'edit';
	};
}

@inject('store')
@observer
export default class EditPost extends React.Component<Props> {
	@observable title = '';
	editorState: any = observable.box(null);

	render() {
		return (
			<CommonLayout>
				<div className="EditPostContainer">
					<Input
						placeholder="标题"
						className={'shadow'}
						defaultValue={this.title}
						onInput={(e: any) => (this.title = e.target.value)}
					/>
					<BraftEditor
						{...{
							className: 'shadow',
							style: {
								backgroundColor: '#fff',
								borderRadius: '0.3em',
								marginTop: '1em'
							} as StyleHTMLAttributes<any>
						} as any}
						value={this.editorState.get()}
						onChange={this.handleEditorChange}
					/>
					<div style={{ marginTop: '1em' }}>
						<Button onClick={this.onSave} type={'primary'} className={'shadow'}>
							发布
						</Button>
					</div>
				</div>
			</CommonLayout>
		);
	}

	onSave = async () => {
		if (this.title.trim() === '') {
			return;
		}
		const content = this.editorState.get().toHTML();
		const ret = await Post.add(this.title, content);
		if (ret.isOk) {
			message.success('发布成功！');
			this.props.store!.emitAddPost();
			Control.go('/');
		} else {
			message.error(ret.get('msg'));
		}
	};

	handleEditorChange = (editorState: any) => {
		this.editorState.set(editorState);
	};
}

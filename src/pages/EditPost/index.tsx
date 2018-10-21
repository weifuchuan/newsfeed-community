import CommonLayout from '@/layouts/CommonLayout/index';
import Post from '@/models/Post';
import { Store } from '@/store';
import { Button, Input, message } from 'antd';
import 'braft-editor/dist/index.css';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { StyleHTMLAttributes } from 'react';
import { Control } from 'react-keeper';
import Loadable from 'react-loadable';
import './index.scss';

interface Props {
	store: Store;
	params: {
		action: 'add' | 'edit';
	};
}

const LoadableBraftEditor = Loadable({
	loading: () => (
		<div
			className="shadow"
			style={{ padding: '1em', backgroundColor: '#fff', marginTop: '1em', borderRadius: '0.5em' }}
		>
			编辑器加载中...
		</div>
	),
	loader: () => import('braft-editor')
});

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
					<LoadableBraftEditor
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

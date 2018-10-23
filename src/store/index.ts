import { observable } from 'mobx';
import Account from '@/models/Account';
import Post from '@/models/Post';
import EventEmitter from 'wolfy87-eventemitter';

export class Store extends EventEmitter {
	@observable me?: Account;
	@observable posts: Post[] = [];

	// pack event bus

	emitAddPost() {
		this.emit('addPost');
	}
	onAddPost(handler: Function) {
		this.on('addPost', handler);
	}
	offAddPost(handler: Function) {
		this.off('addPost', handler);
	}

	emitUpdateMyNewsfeed() {
		this.emit('UpdateMyNewsfeed');
	}
	onUpdateMyNewsfeed(handler: Function) {
		this.on('UpdateMyNewsfeed', handler);
	}
	offUpdateMyNewsfeed(handler: Function) {
		this.off('UpdateMyNewsfeed', handler);
	}
}

const store = new Store();

export default store;

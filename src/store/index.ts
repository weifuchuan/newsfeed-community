import { observable } from 'mobx';
import Account from '@/models/Account';
import Post from '@/models/Post';
import EventEmitter from "wolfy87-eventemitter"

export class Store extends EventEmitter {
	@observable me?: Account;
	@observable accounts: Account[] = [];
	@observable posts: Post[] = [];
}

const store = new Store(); 

export default store;


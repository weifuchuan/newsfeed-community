import { observable } from 'mobx';
import Account from '@/models/Account';
import Post from '@/models/Post';

export class Store {
	@observable me?: Account;
	@observable accounts: Account[] = [];
	@observable posts: Post[] = [];
}

const store = new Store(); 

export default store;


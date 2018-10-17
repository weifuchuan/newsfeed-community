import { observable } from 'mobx';
import Account from '../models/Account';

export class Store {
	@observable me?: Account;
	@observable accounts: Account[] = [];
}

const store = new Store();

export default store;

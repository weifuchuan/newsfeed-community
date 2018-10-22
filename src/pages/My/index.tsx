import UserPage from '@/components/UserPage';
import { Store } from '@/store';
import { inject, observer } from 'mobx-react';
import React from 'react';
import './index.scss';

interface Props {
	store: Store;
}

@inject('store')
@observer
export default class My extends React.Component<Props> { 
	render() {
		return ( 
      <UserPage account={this.props.store.me!} />
		);
	} 
}

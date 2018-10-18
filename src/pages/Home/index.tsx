import React from 'react';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import Counter from '@/components/Counter';
import { Control } from 'react-keeper';
import Post from '@/models/Post';
import { POST } from '@/kit/req';

interface Props {
	store?: Store;
}

@inject("store")
@observer
export default class Home extends React.Component<Props> {
	render() {
		return <div className="HomeContainer" />;
	}

	private readonly fetchDataFromServer = async () => {
    const resp = await POST("/home");
    
  };
}

import React from 'react';
import "./index.scss"; 
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';

interface Props {
  store: Store; 
  params: {
    id: string;
  };
}

@inject("store")
@observer
export default class Post extends React.Component<Props> {
  render(){
    return (
      <div className="PostContainer" >
      
      </div>
    )
  }
}
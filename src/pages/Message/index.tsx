import React from 'react';
import "./index.scss"; 
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';

interface Props {
  store: Store; 
}

@inject("store")
@observer
export default class Message extends React.Component<Props> {
  render(){
    return (
      <div className="MessageContainer" >
      
      </div>
    )
  }
}
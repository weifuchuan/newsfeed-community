import React from 'react';
import "./index.scss"; 
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import Remind from '@/models/Remind';
import { observable, computed } from 'mobx';

interface Props {
  store?: Store; 
}

@inject("store")
@observer
export default class RemindBox extends React.Component<Props> {
	@observable remind = new Remind();
	@computed
	get remindTextList(): string[] {
		
		return [];
  }
  
  render(){
    return (
      <div>
      <div className="RemindBoxContainer" >
      
      </div>
      </div>
    )
  }
}
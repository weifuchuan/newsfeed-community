import React from 'react';
import "./index.scss"; 
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';

interface Props {
  store: Store; 
  params:{
    action:"add"|"edit"; 
  };
}

@inject("store")
@observer
export default class EditPost extends React.Component<Props> {
  render(){
    return (
      <div className="EditPostContainer" >
        <div>
          
        </div>
      </div>
    )
  }
}
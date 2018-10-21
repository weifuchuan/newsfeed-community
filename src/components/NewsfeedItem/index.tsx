import React from 'react';
import "./index.scss"; 
import { observer, inject } from 'mobx-react';
import { Store } from '@/store'; 
import Newsfeed from '@/models/Newsfeed'; 

interface Props {
  store?: Store; 
  newsfeed:Newsfeed;
}

@inject("store")
@observer
export default class NewsfeedItem extends React.Component<Props> {
  
  render(){
    const ns =this.props.newsfeed; 

    return (
      <div className={"NewsfeedItem"} >
        <div>

        </div>
        <div>
          
        </div>
        <div>
          
        </div>
      </div>
    )
  }
 
}
import React from 'react';
import "./index.scss"; 
import { observer, inject } from 'mobx-react';
import { Store } from '@/store';
import CommonLayout from '@/layouts/CommonLayout';
import { observable, runInAction, toJS } from 'mobx';
import Newsfeed from '@/models/Newsfeed';
import { Spin } from 'antd';
import NewsfeedItem from '@/components/NewsfeedItem';

interface Props {
  store: Store; 
}

@inject("store")
@observer
export default class My extends React.Component<Props> {
  @observable newsfeeds:Newsfeed[]=[]; 
  @observable pageNumber = 1;
  @observable totalPage = 1;
@observable loading=false;
  render(){
    return (
      <CommonLayout>
        {this.newsfeeds.map(ns=>{
          return <NewsfeedItem newsfeed={ns} key={ns.id} />
        })}
        <Spin
						size="large"
						spinning={this.loading}
						style={{ position: 'fixed', left: '50vw', top: '50vh' }}
					/>
      </CommonLayout>
    )
  }

  componentDidMount(){
    (async()=>{
      this.loading=true;
      const {newsfeeds,pageNumber,totalPage}= await Newsfeed.paginate(this.props.store.me!.id)    
      runInAction(()=>{
        this.newsfeeds = observable(newsfeeds); 
        console.log(toJS(newsfeeds));
        this.pageNumber=pageNumber; 
        this.totalPage=totalPage;       
        this.loading=false;
      })
    })();
  }
}
import React, { Component } from 'react';
import classNames from 'classnames';

export class BoardCell {

  constructor(isBomb){
    this.isBomb = isBomb;
    this.count = 0;
  }

  incrementCount() {
    this.count = this.count + 1;
  }
}

export class Cell extends Component {

  constructor(props){
    super(props);
    this.state = {
      'isHidden': true,
      'isFlagged': false
    };

    this.expose = this.expose.bind(this);
    this.flag = this.flag.bind(this);
  }

  componentWillUnmount() {

  }

  expose(e){
    console.log('expose');
    this.setState(prevState => ({isHidden: false}));
    let exposeEvent = new CustomEvent('exposedCell', {'detail': this.props});
    window.dispatchEvent(exposeEvent);

    //console.log(e.nativeEvent.which);
    //console.log(e.type);
  }

  flag(e){
    console.log('flag cell');
    this.setState({isFlagged: true});
    e.preventDefault();
  }

  render() {
    //{this.isHidden ? this.count : ' '}
    let content = ' ';
    if(this.state.isHidden){
      if(this.state.isFlagged){
        content = 'F';
      }
    } else {
      if(this.props.isBomb){
        content = 'X';
        //TODO game ends!
      } else if(this.props.count>0) {
        content = this.props.count;
      }
    }
    let classes = classNames('Cell', {'exposed': !this.state.isHidden});
    return (
      <div className={classes} onClick={this.expose} onContextMenu={this.flag}>
        {content}
      </div>)
  }

}

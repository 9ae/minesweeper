import React, { Component } from 'react';
import classNames from 'classnames';

export class BoardCell {

  constructor(x, y){
    this.x = x;
    this.y = y
    this.isBomb = false;
    this.count = 0;
    this.view = null;
    this.visited = false;
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

  componentDidMount(){
    let evt = new CustomEvent('cellMounted',
      {'detail': this});
    window.dispatchEvent(evt);
  }

  componentWillUnmount() {

  }

  isExposed(){
    return !this.state.isHidden;
  }

  flip(){
    this.setState(prevState => ({isHidden: false}));
  }

  expose(e){
    console.log('expose');
    let exposeEvent = new CustomEvent('exposedCell', {'detail': this.props});
    window.dispatchEvent(exposeEvent);

    //console.log(e.nativeEvent.which);
    //console.log(e.type);
  }

  flag(e){
    console.log('flag cell');
    this.setState({isFlagged: true});
    let flagEvent = new CustomEvent('flagCell', {'detail': this.props});
    window.dispatchEvent(flagEvent);
    e.preventDefault();
  }

  render() {

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

    //let content = this.props.isBomb ? 'X' : this.props.count;
    let classes = classNames('Cell', {'exposed': !this.state.isHidden});
    return (
      <div className={classes} onClick={this.expose} onContextMenu={this.flag}>
        {content}
      </div>)
  }

}

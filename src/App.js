import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {BoardCell, Cell} from './Cell';

export function index2xy(dim){
  return function(index){
    return {y: Math.floor(index/dim), x: index%dim}
  }
}

export function xy2index(dim){
  return function(x, y){
    return dim*y + x;
  }
}

export const GAME_STATE_PLAY = 'playing';
export const GAME_STATE_WIN = 'won';
export const GAME_STATE_DIE = 'died';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      gameState: GAME_STATE_PLAY
    }

    this.boardDim = 8;
    this.xy = index2xy(this.boardDim);
    this.index = xy2index(this.boardDim);

    this.mines = this.createMines(10);
    this.minesFlagged = 0;
    this.board = this.createBoard(this.boardDim);
    this.countMines();

    this.handleExposedCell = this.handleExposedCell.bind(this);
    window.addEventListener('exposedCell', this.handleExposedCell , false);
  }

  handleExposedCell(e){
    let isBomb = e.detail.isBomb;
    if(isBomb){
      this.setState({gameState: GAME_STATE_DIE});
    } else {

    }
  }

  getCell(x, y){
    if(y<0 || x<0){
      return null;
    }
    else if(y>=this.boardDim || x>=this.boardDim){
      return null;
    } else {
      let ind = this.index(x, y);
      return this.board[ind];
    }
  }

  addCountToCell(x, y){
    let cell = this.getCell(x, y);
    if(cell != null){
      cell.incrementCount();
    }

  }

  createBoard(){
    let boardSize = this.boardDim*this.boardDim;
    console.log(this.mines);
    let board = [];
    for(let n=0; n<boardSize; n++){
      let cell = new BoardCell(this.mines.indexOf(n) >= 0);
      board.push(cell)
    }
    return board;
  }

  createMines(total){
    let mines = [];
    let boardSize = this.boardDim*this.boardDim;
    while(mines.length < total){
      let ind = Math.floor(Math.random()*boardSize);
      if(mines.indexOf(ind) == -1){
        mines.push(ind);
      }
    }
    //return mines.map((e) => [Math.floor(e/this.boardDim), e%this.boardDim]);
    return mines;
  }

  countMines(){
    for(let m =0; m<this.mines.length; m++){
      let bombIndex = this.mines[m];
      let pos = this.xy(bombIndex);
      //let bombCell = this.board[bombIndex];
      this.addCountToCell(pos.x-1, pos.y-1);
      this.addCountToCell(pos.x, pos.y-1);
      this.addCountToCell(pos.x+1, pos.y-1);
      this.addCountToCell(pos.x-1, pos.y);
      this.addCountToCell(pos.x+1, pos.y);
      this.addCountToCell(pos.x-1, pos.y+1);
      this.addCountToCell(pos.x, pos.y+1);
      this.addCountToCell(pos.x+1, pos.y+1);
    }
  }

  render() {
    var boardRenders = this.board.map((e, i) =>
      <Cell key={i.toString()} isBomb={e.isBomb} count={e.count} coord={i} />);
    return (
      <div>
      <h1>Game State: {this.state.gameState}</h1>
      <div className="Board">
        {boardRenders}
      </div>
      </div>
    );
  }
}

export default App;

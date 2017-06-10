import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {BoardCell, Cell} from './Cell';

export const GAME_STATE_PLAY = 'playing';
export const GAME_STATE_WIN = 'won';
export const GAME_STATE_DIE = 'died';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      gameState: GAME_STATE_PLAY
    }

    this.boardDim = 10;
    this.minesTotal = 40;
    this.minesFlagged = 0;

    this.board = this.createBoard();
    this.addMines();

    this.handleExposedCell = this.handleExposedCell.bind(this);
    window.addEventListener('exposedCell', this.handleExposedCell , false);

    this.handleFlagCell = this.handleFlagCell.bind(this);
    window.addEventListener('flagCell', this.handleFlagCell, false);

    this.handleCellMounted = this.handleCellMounted.bind(this);
    window.addEventListener('cellMounted', this.handleCellMounted, false);
  }

  handleCellMounted(e){
    let view = e.detail;
    let p = view.props.coord;
    this.board[p[0]][p[1]].view = view;
  }

  handleExposedCell(e){
    let isBomb = e.detail.isBomb;
    let y = e.detail.coord[0], x = e.detail.coord[1];
    if(isBomb){
      this.showAllMines();
      this.setState({gameState: GAME_STATE_DIE});
    } else {
      this.expandExposure(x, y);
    }
  }

  expandExposure(x, y){
    let cell = this.board[y][x];
    if(cell.isBomb){
      return
    }
    else if (cell.visited){
      return
    }
    else {
      cell.visited = true;
      cell.view.flip();
      if(cell.count ==0){
        let neighbors = this.getAdjacent(x, y);
        neighbors.forEach((e) => {
          this.expandExposure(e.x, e.y);
        });
      }
    }

  }

  handleFlagCell(e){
    let isBomb = e.detail.isBomb;
    console.log(isBomb);
    if(isBomb){
      this.minesFlagged = this.minesFlagged + 1;
      if(this.minesFlagged === this.minesTotal){
        this.setState({gameState: GAME_STATE_WIN});
      }
    }
  }

  getCell(x, y){
    if(y<0 || x<0){
      return null;
    }
    else if(y>=this.boardDim || x>=this.boardDim){
      return null;
    } else {
      return this.board[y][x];
    }
  }

  createBoard(){
    let board = [];
    for (let i=0; i<this.boardDim; i++){
      let row = [];
      for(let j=0; j<this.boardDim; j++){
        let cell = new BoardCell(j, i);
        row.push(cell)
      }
      board.push(row);
    }

    return board;
  }

  addMines(){
    let mines = this.createMines();
    for(let m =0; m<mines.length; m++){
      let y = mines[m][0], x = mines[m][1];
      let bombCell = this.board[y][x];
      bombCell.isBomb = true;
      let neighbors = this.getAdjacent(x, y);
      neighbors.forEach((e)=>{
        e.incrementCount();
        return e;
      });
    }

  }

  createMines(){
    let mines = [];
    let boardSize = this.boardDim*this.boardDim;
    while(mines.length < this.minesTotal){
      let ind = Math.floor(Math.random()*boardSize);
      if(mines.indexOf(ind) == -1){
        mines.push(ind);
      }
    }
    return mines.map((e) => [Math.floor(e/this.boardDim), e%this.boardDim]);
  }

  showAllMines(){
    for (let i=0; i<this.boardDim; i++){
      for(let j=0; j<this.boardDim; j++){
        let cell = this.board[i][j];
        if(cell.isBomb){
          cell.view.flip();
        }
      }
    }
  }

  getAdjacent(x, y){
    let cells = [];
    cells.push(this.getCell(x-1, y-1));
    cells.push(this.getCell(x, y-1));
    cells.push(this.getCell(x+1, y-1));
    cells.push(this.getCell(x-1, y));
    cells.push(this.getCell(x+1, y));
    cells.push(this.getCell(x-1, y+1));
    cells.push(this.getCell(x, y+1));
    cells.push(this.getCell(x+1, y+1));

    return cells.filter((e) => e != null );
  }

  render() {
    var boardRenders = [];
    for (let i=0; i<this.boardDim; i++){
      for(let j=0; j<this.boardDim; j++){
        let e = this.board[i][j];
        let n = i * this.boardDim + j;
        let cellView = (<Cell key={n.toString()} isBomb={e.isBomb} count={e.count} coord={[i, j]} />);
        boardRenders.push(cellView);
      }
    }
    return (
      <div className="App">
      <h1>Game State: {this.state.gameState}</h1>
      <div className="Board">
        {boardRenders}
      </div>
      </div>
    );
  }
}

export default App;

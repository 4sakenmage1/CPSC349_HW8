import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(object) {
  return (
    <button className="square" onClick={object.onClick} style={{ backgroundColor: object.color }}
    >
      {object.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let color = "white";

    if(this.object.winningSets){
      for(let j = 0; j< this.winningSets.length; j++){
        if(i === this.winningSets[j]){
          color = "red";
        }
      }
    }
    return (<Square color = {color} value = {this.object.squares[i]} onClick = {() => this.object.onClick(i)} />);
  }

  render() {
    let itemList = [];
    let position = 0;
    for(let i = 0; i < this.boardsize; i++){
      let innerList = [];
      for(let j = 0; j < this.boardsize; j++){
        innerList.push(<div>{this.renderSquare(position)}</div>);
      }
      itemList.push(<div className="board-row">{innerList}</div>);
    }
    return ( <div>{itemList}</div>);
  }
}

class Game extends React.Component {
  constructor(object) {
  super(object);
  this.state = {
    history: [{squares: Array(9).fill(null)}],
    stepNum: 0,
    xIsNext: true,
    size: 0,
    location: []
  };
}
handleClick(i){
  let column = (i % this.state.size) + 1;
  let row = Math.floor(i / this.state.size) +1;

  const history = this.state.history.slice(0, this.state.stepNum +1);
  const location = this.state.location.slice(0,this.state.stepNum+1);
  const curr = history[history.length -1];
  const squares = curr.squares.slice();
  if(calculateWinner(squares,this.state.size) || squares[i]){
    return;
  }

  squares[i] = this.state.xIsNext ? "X" : "O";
  this.setState({
    history: history.concat([{squares: squares}]),
      stepNum: history.length,
      xIsNext: !this.setState.xIsNext,
      location: history.concat(row + ',' + column),
      asc: true
  });
}

jumpTo(step) {
    this.setState({
      stepNum: step,
      xIsNext: step % 2 === 0
    });
  }

render(){
  const history = this.state.history;
  const curr = history[this.state.stepNum];

  let winner;
  let winningSet;
  if (calculateWinner(curr.squares, this.state.size)) {
    winner = calculateWinner(curr.squares, this.state.size)[0];
    winningSet = calculateWinner(curr.squares, this.state.size)[1];
  }

  let moves;
  if(this.state.asc){
    moves = history.map((step,move) => {
      const desc = move ? 'Go To Move #'+ move +' - ' +  this.state.location[move - 1] : 'Go To Game Start';
      if(this.state.size === 0){
        return <div key = {move}/>;
      }
      if(this.state.stepNum === move){
        return(
          <li key={move}>
            <button onClick= {() => this.jumpTo(move)}>
              <b>{desc} </b>
            </button>
          </li>
        );
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
  }else{
    moves = history.map((step,move) =>{
      const back = history.length - move - 1;
      const desc = back ?  "Go to move #" + back + " - " + this.state.location[back - 1] : "Go to game start";
      if (this.state.size === 0) {
        return <div key={0} />;
      }
      if (this.state.stepNumber === back) {
        return (
          <li key={back}>
            <button onClick={() => this.jumpTo(back)}>
              <b>{desc}</b>
            </button>
          </li>
        );
      }
      return (
        <li key={back}>
          <button onClick={() => this.jumpTo(back)}>{desc}</button>
        </li>
      );
    });
  }

  let status;
  if(winner){
    status = "Winner is " + winner;
  } else{
    if(this.state.size === 0){
      status = "Set Map Size: ";
    }else{
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }
  }
  return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={curr.squares}
              onClick={i => this.handleClick(i)}
              boardsize={this.state.size}
              winningSets={winningSet}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button
              style={{ display: this.state.size === 0 ? "none" : "block" }}
              onClick={() => this.setState({ asc: !this.state.asc })}
            >
              Ascending/Decending
            </button>
            <div style={{ display: this.state.size === 0 ? "block" : "none" }}>
              <button
                onClick={() => {
                  this.setState({
                    size: 3
                  });
                }}
              >
                3x3
              </button>
              <button
                onClick={() => {
                  this.setState({ size: 4 });
                }}
              >
                4x4
              </button>
              <button
                onClick={() => {
                  this.setState({ size: 5 });
                }}
              >
                5x5
              </button>
            </div>
            <ol>{moves}</ol>   
          </div>
        </div>
      );}
  //Game End
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares, size){
  const lines = [];

  let counter = 0;
  for (let i = 0; i < size; i++) {
    let inner = []; //side
    for (let y = 0; y < size; y++) {
      inner.push(counter);
      counter++;
    }
    lines.push(inner); //down

    inner = [];
    for (let y = i; y < size * size; y = y + size) {
      inner.push(y);
    }
    lines.push(inner);
  } //diagonals

  counter = 0;
  let counterback = size - 1;
  let inner = [];
  let innerback = [];
  for (let i = 0; i < size; i++) {
    inner.push(counter);
    innerback.push(counterback);
    counter += size + 1;
    counterback += size - 1;
  }
  lines.push(inner);
  lines.push(innerback);

  for (let i = 0; i < lines.length; i++) {
    if (size === 3) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return [squares[a], lines[i]];
      }
    } else if (size === 4) {
      const [a, b, c, d] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] === squares[d]
      ) {
        return [squares[a], lines[i]];
      }
    } else if (size === 5) {
      const [a, b, c, d, e] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] === squares[d] &&
        squares[a] === squares[e]
      ) {
        return [squares[a], lines[i]];
      }
    }
  }

  if (size === 0) {
      return null;
    }

    for (let h = 0; h < squares.length; h++) {
      if (squares[h] === null) {
        return null;
      }
    }

    return ["Tie", []];


}

import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={highlight ? "squareHighlighted" : "square"} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  if (!squares) return;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay, winner, justMoved }) {
  let status;
  if (winner) {
    status = 'Winner: ' + squares[winner[0]];
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function handleClick(i) {
    if (squares[i]) {
      return;
    }

    // set state
    onPlay(squares, i);
  }


  return (
    <>
      <div className="status">{status}</div>
      {squares && Array.from(
        { length: 3, className: "board-row" },
        (_, i) => <div> {(
          Array.from(
            { length: 3 },
            (_, j) => (
              <Square value={squares[i * 3 + j]} onSquareClick={() => handleClick(i * 3 + j)} highlight={winner && winner.includes(i * 3 + j)} />
            )
          )

        )}</div>)}
        <div className='oldMove'>{`Current: ${justMoved}`}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ sq: Array(9).fill(null), i: -1 }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [asc, setAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0; // x always goes first
  const currentSquares = history[currentMove].sq;
  const winner = calculateWinner(currentSquares);

  function handlePlay(squares, i) {

    if (calculateWinner(squares)) {
      // if (history[currentMove].sq[winner[0]] !== '*')
      // {
      //   winner.map((m) => (history[currentMove].sq[m] = '*'));
      //   setHistory(history.slice());
      // }
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    if (history.length == 1) history[0].i = i;
    // you only want to keep the history up to current move point
    const nextHistory = [...history.slice(0, currentMove + 1), { sq: nextSquares, i: i }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to ${(move % 2 != 0 ? "X's" : "O's")} move (${Math.floor((squares.i) / 3) + 1}, ${(squares.i) % 3 + 1})`;
    } else {
      description = `Go to start`;
    }
    return (
      <li key={move}>
        <>{`${move}. `}</>
        {move !== currentMove ? <button onClick={() => jumpTo(move)}>{description}</button>
          : move !== 0 ? <>{`You're on move #${move}`}</> : <>{'Make a move!'}</>}
      </li>
    );
  });
  if (!asc) moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winner={winner} 
        justMoved={history[history.length - 1].i !== -1 ? `${currentMove % 2 != 0 ? "X" : "O"}(${Math.floor((history[history.length - 1].i) / 3) + 1}, ${(history[history.length - 1].i) % 3 + 1})` : ''} />
      </div>
      <div className="game-info">
        <ol  style={{ listStyle: 'none' }}>{moves}</ol>
      </div>
      <div>
        <button onClick={() => setAsc(false)}>{"Descending"}</button>
        <button onClick={() => setAsc(true)}>{"Ascending"}</button>
      </div>
    </div>
  );
}
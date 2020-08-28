import React from 'react';
import styled from 'styled-components'

// Components
import Gameboard from './components/Gameboard'

// Styles
import './App.css';


// Styles
const StyledApp = styled.div`

  header {
    font-weight: 900;
    text-align: center;
    font-size: 2.5rem;
    margin: 1% 0 2%;
  }

  .rules {
    text-align:center;
    list-style-position: inside;
  }
`

function App() {
  return (
    <StyledApp>
      <header>Conway's Game of Life</header>
      <Gameboard />
      <div className="rules">
        <h2>Rules of the Game of Life</h2>
        <ol>
          <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
          <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
        </ol>
      </div>
    </StyledApp>
  );
}

export default App;

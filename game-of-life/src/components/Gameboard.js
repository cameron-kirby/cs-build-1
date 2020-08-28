import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
// FA
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faDiceFive, faEraser } from '@fortawesome/free-solid-svg-icons'

// Styles
const StyledGameboard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    .controls{
        width: 40%;
        .buttons {
            width: 100%;
            margin: auto;
            display: flex;
            justify-content: space-between;
        }

        button {
            width: 10%;
            background-color: #42E2B8;
            color: #07004D;
            font-size: 1.5rem;
            border-radius: 12px;
            border: 0px;
            padding: 2% 2.5%;
            /* margin: 5px; */
        }
        select {
            width: auto;
            font-weight: 700;
            font-size: 1.4rem;
            background-color: #42E2B8;
            color: #07004D;
            border-radius: 12px;
            padding: 2% 2.5%;
            /* margin: 5px; */
        }
    }
`

// Creates 2D Array of size specified 
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

// Populates Grid randomly
function setup(grid, cols, rows){
    // Auto Populate
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0;
        }
    }
    return grid
}

function countNeighbors(grid, x, y, cols, rows) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            // Wrap around
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    // Return count of live neighbors
    return sum;
}

const Gameboard = props => {
    // State
    const [columns, setColumns] = useState(25)
    const [rows, setRows] = useState(25)
    const [resolution, setResolution] = useState(16)
    const [grid, setGrid] = useState(make2DArray(columns, rows))
    const [running, setRunning] = useState(false)
    const [gamespeed, setGamespeed] = useState(500)
    const [generation, setGeneration] = useState(0)

    const canvasRef = useRef(null) // Reference to canvas
  
    const draw = ctx => {
        // Set background to default
        ctx.fillStyle = '#2D82B7';
        ctx.fillRect(0,0, 400, 400);
        // Change style back to black
        ctx.fillStyle = '#42E2B8';
        // Draw grid
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                let x = i * resolution;
                let y = j * resolution;
                if (grid[i][j] === 1) {
                    ctx.fillRect(y, x, resolution - 1, resolution - 1);
                }
            }
        }
    }

    const compute = () => {
        let next = make2DArray(columns, rows)

        // Compute next generation based on previous
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j];
                // Count live neighbors!
                let neighbors = countNeighbors(grid, i, j, columns, rows);

                if (state === 0 && neighbors === 3) { // Spawn
                    next[i][j] = 1
                } else if (state === 1 && (neighbors < 2 || neighbors > 3)) { // Kill
                    // If alive, and neighbor count < 2 or > 3, cell dies
                    next[i][j] = 0
                } else { // Live
                    next[i][j] = state;
                }
            }
        }
        // Set grid to next
        setGrid(next)
        // Increment generation
        setGeneration(generation + 1)
    }

    // On Canvas click handle
    const canvasHandler = event => {
        if(running){
            return
        }
        let canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const x = Math.floor((event.clientX - rect.left) / (resolution))
        const y = Math.floor((event.clientY - rect.top) / (resolution))
        console.log("x: " + x + " y: " + y)

        let newGrid = grid
        if(newGrid[y][x] === 1) {
            // If alive
            newGrid[y][x] = 0
        } else if (newGrid[y][x] ===0){
            // If dead
            newGrid[y][x] = 1
        }
        setGrid(newGrid)
        draw(canvasRef.current.getContext("2d"))
    }

    // Button utils
    const toggleRunning = () => {
        if (running) {
            setRunning(() => {return false})
        } else {
            setRunning(() => {return true})
        }
    }

    const randomizeGrid = () => {
        if(running){
            return
        }

        let randGrid = make2DArray(columns, rows)
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                randGrid[i][j] = Math.floor(Math.random() * 2);
            }
        }

        // Set grid to next
        setGrid(randGrid)
        // Increment generation
        setGeneration(0)
    }

    const clearGrid = () => {
        setGrid(setup(grid, columns, rows))
        setGeneration(0)
        draw(canvasRef.current.getContext("2d"))
    }

    const usePreset1 = () => {
        if(running){
            return
        }
        // Setup blank array
        let preset = make2DArray(columns, rows)
        preset = setup(preset, columns, rows)
        // Create grid layout for first osc
        preset[9][5] = 1
        preset[10][5] = 1
        preset[11][5] = 1
        preset[12][5] = 1
        preset[13][5] = 1
        preset[14][5] = 1
        preset[15][5] = 1
        preset[16][5] = 1
        preset[9][6] = 1
        preset[11][6] = 1
        preset[12][6] = 1
        preset[13][6] = 1
        preset[14][6] = 1
        preset[16][6] = 1
        preset[9][7] = 1
        preset[10][7] = 1
        preset[11][7] = 1
        preset[12][7] = 1
        preset[13][7] = 1
        preset[14][7] = 1
        preset[15][7] = 1
        preset[16][7] = 1
        // Create grid layout for second osc
        preset[9][17] = 1
        preset[10][17] = 1
        preset[11][17] = 1
        preset[12][17] = 1
        preset[13][17] = 1
        preset[14][17] = 1
        preset[15][17] = 1
        preset[16][17] = 1
        preset[9][18] = 1
        preset[11][18] = 1
        preset[12][18] = 1
        preset[13][18] = 1
        preset[14][18] = 1
        preset[16][18] = 1
        preset[9][19] = 1
        preset[10][19] = 1
        preset[11][19] = 1
        preset[12][19] = 1
        preset[13][19] = 1
        preset[14][19] = 1
        preset[15][19] = 1
        preset[16][19] = 1
        setGrid(preset)
        setGeneration(0)
        draw(canvasRef.current.getContext("2d"))
    }

    const usePreset2 = () => {
        if(running){
            return
        }
        // Setup blank array
        let preset = make2DArray(columns, rows)
        preset = setup(preset, columns, rows)
        preset[5][5] = 1
        preset[7][5] = 1
        preset[7][4] = 1
        preset[6][7] = 1
        preset[7][8] = 1
        preset[7][9] = 1
        preset[7][10] = 1


        setGrid(preset)
        setGeneration(0)
        draw(canvasRef.current.getContext("2d"))
    }

    const usePreset3 = () => {
        if(running){
            return
        }
        // Setup blank array
        let preset = make2DArray(columns, rows)
        preset = setup(preset, columns, rows)
        preset[3][6] = 1
        preset[4][7] = 1
        preset[5][5] = 1
        preset[5][6] = 1
        preset[5][7] = 1
        setGrid(preset)
        setGeneration(0)
        draw(canvasRef.current.getContext("2d"))
    }

    // Side Effects
    useEffect(() => { // Load Effect
        // Get Canvas reference
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        // Set canvas resolution
        canvas.width = 400
        canvas.height = 400
        setGrid(setup(grid, columns, rows))
        // console.log(grid)
    }, [])

    useEffect(() => { // Canvas Effect
        // Get Canvas reference
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        // Draw
        draw(context)
    }, [draw])

    useEffect(() => { // Running Effect
        if(running) {
            setTimeout(() => {
                compute()
            }, gamespeed)
        }
    })
    return (
        <StyledGameboard>
            <canvas ref={canvasRef} {...props} onClick={canvasHandler}/>
            <div className="controls">
                <h2>Generation: {generation}</h2>
                <div className="buttons">
                    <button onClick={toggleRunning}>{running ?<FontAwesomeIcon icon={faPause} />:<FontAwesomeIcon icon={faPlay} />}</button>
                    <button onClick={randomizeGrid}><FontAwesomeIcon icon={faDiceFive} /></button>
                    <button onClick={clearGrid}><FontAwesomeIcon icon={faEraser} /></button>
                    <select id="speed" name="speed" onChange={ event=> {setGamespeed(event.target.value)} }>
                        <option value="500">Slow</option>
                        <option value="250" selected="selected">Normal</option>
                        <option value="100">Fast</option>
                    </select>
                    <button onClick={usePreset1}>P1</button>
                    <button onClick={usePreset2}>P2</button>
                    <button onClick={usePreset3}>P3</button>
                </div>
            </div>
        </StyledGameboard>
    )
}

export default Gameboard
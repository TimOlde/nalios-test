const rows = 100;
const cols = 100;
const cellSize = 8;
const bgColor = "#0D1164";
const cellColors = ["#F78D60", "#EA2264", "#640D5F"];
const frameRateValue = 20;
const maxAge = 10; // Cells die when they reach this age

const populationBoomThreshold = 0.3 // If the noise value is below this, cell starts alive
const populationBoomMeanInterval = 50; // Mean frames between population booms
const populationBoomStdDev = 15; // Standard deviation for boom interval
let frameCountSinceLastBoom = 0;
let nextBoomInterval = 50; // Will be set with normal distribution
let noiseZVelocity = 0.1;
let noiseZ = 0;

let grid;

function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the cell itself
      if (
        x + i < 0
        || x + i >= rows
        || y + j < 0
        || y + j >= cols
      ) continue; // Skip out-of-bounds

      sum += grid[x + i][y + j].value;
    }
  }
  return sum;
}

function setup() {
  createCanvas(rows * cellSize, cols * cellSize);
  pixelDensity(displayDensity());
  colorMode(HSB, 360, 100, 100, 1);

  frameRate(frameRateValue);
  
  // Set the first boom interval using normal distribution
  nextBoomInterval = max(10, randomGaussian(populationBoomMeanInterval, populationBoomStdDev));
  
  grid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      grid[i][j] = {
        value : noise(i * 0.1, j * 0.1) < populationBoomThreshold ? 1 : 0,
        age: 0
      };
    }
  }
}

function draw() {
  background(bgColor);

  // Draw current grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j].value === 1) {
        // Determine color based on age
        let colorIndex = min(grid[i][j].age, cellColors.length - 1);
        fill(cellColors[colorIndex]);
        noStroke();
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }

  // Compute next generation
  let newGrid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    newGrid[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      let neighbors = countNeighbors(i, j);
      
      // Check if cell dies from old age
      if (grid[i][j].value === 1 && grid[i][j].age >= maxAge) {
        newGrid[i][j] = { value: 0, age: 0 }; // Cell dies from old age
      } else if (grid[i][j].value === 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[i][j] = { value: 0, age: 0 }; // Cell dies from under/overpopulation
      } else if (grid[i][j].value === 0 && neighbors === 3) {
        newGrid[i][j] = { value: 1, age: 0 }; // Cell becomes alive, start at age 0
      } else {
        // Cell stays the same
        if (grid[i][j].value === 1) {
          newGrid[i][j] = { value: 1, age: grid[i][j].age + 1 }; // Increment age if alive
        } else {
          newGrid[i][j] = { value: 0, age: 0 }; // Dead cell stays dead
        }
      }
    }
  }
  grid = newGrid;

  // Handle population boom
  frameCountSinceLastBoom++;
  if (frameCountSinceLastBoom >= nextBoomInterval) {
    noiseZ += noiseZVelocity;
    frameCountSinceLastBoom = 0;
    
    // Set next boom interval using normal distribution (minimum 10 frames)
    nextBoomInterval = max(10, randomGaussian(populationBoomMeanInterval, populationBoomStdDev));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (noise(i * 0.1, j * 0.1, noiseZ) < populationBoomThreshold) {
          grid[i][j] = { value: 1, age: 0 }; // Cell becomes alive, start at age 0
        }
      }
    }
  }
}
// Board Templates
const board1 =
  "7218..945849.57326.3.249817.5798.6349634157.228.3761.9.1...4568.9..21473...53829.";
const board2 =
  "1.2.54.37367..84..9.5673218..4.16..3....871.6816...5.44.1.69382....317.57.38.5961";
const board3 =
  ".6.1...5...83.56..2.......18..4.7..6..6...3..7..9.1..45.......2..7..69...4...8.7.";
const board4 =
  "...7.....1.45.9....79..18....7....5....3.4.6.....2...9.....7.....24..1..4.395....";
const board5 =
  "...7.....1.45.9....79..18....7....5....3.4.6.....2...9.....7.....24..1..4.395....";
const board6 =
  "..1.8.6.4.376.....5.............5.....6.1.8.....4.............3.....752.8.2.9.7..";
const board7 =
  "..2.9.1.7.386.....4.............5.....9.1.3.....4.............4.....792.8.6.3.7..";

// Game state
// First create an empty list and then populate it with a board
var state = [];
var possible_nums_state = [];

for (let i = 0; i <= 8; i++) {
  let row1 = [];
  let row2 = [];
  for (let j = 0; j <= 8; j++) {
    row1.push(0);
    row2.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
  state.push(row1);
  possible_nums_state.push(row2);
}

// When a box is clicked, put it's id here
var clicked_but = null;
var num_choice = null;

function resetGame() {
  state = [];
  possible_nums_state = [];
  for (let i = 0; i <= 8; i++) {
    let row1 = [];
    let row2 = [];
    for (let j = 0; j <= 8; j++) {
      row1.push(0);
      row2.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
    state.push(row1);
    possible_nums_state.push(row2);
  }
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {

        let box_id = "num" + j.toString() + i.toString();
        let box = document.getElementById(box_id);
        box.value = null;
    }
  }
  loadGame();
}

// Loads a template to the game board
function loadGame() {
  // Index to get numbers from the board template
  let b_index = 0;

  // j is the x coor of state
  // i is the y coor of state
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      // If box is not empty on the template
      if (board1[b_index] !== ".") {
        // Update the state
        state[j][i] = parseInt(board1[b_index]);

        // Update possibility lists
        possible_nums_state[j][i] = [parseInt(board1[b_index])];

        // Change button value on screen
        let box_id = "num" + j.toString() + i.toString();
        let box = document.getElementById(box_id);
        box.value = state[j][i];
        box.style.color = "gray";
      }
      b_index += 1;
    }
  }
  updatePossibleValuesState();
}

function findPossibleValuesForBox(x, y) {
  // List of possible values
  var pos_val = [];
  // List of impossible values
  var impos_val = [];

  // Check row and column
  for (let i = 0; i <= 8; i++) {
    if (state[x][i] !== 0) {
      impos_val.push(state[x][i]);
    }
    if (state[i][y] !== 0) {
      impos_val.push(state[i][y]);
    }
    }

  // Check which subgrid
  // list of 2 elements. X and Y coors of top left square of subgrid
  // to which the box belongs to
  let subgridTopLeft = topLeftCoorsOfSubgrid(x, y);

  // check subgrid
  for (let i = subgridTopLeft[1]; i <= subgridTopLeft[1] + 2; i++) {
    for (let j = subgridTopLeft[0]; j <= subgridTopLeft[0] + 2; j++) {
      if (state[j][i] !== 0) {
        impos_val.push(state[j][i]);
      }
    }
  }

  // Possible values are all nums from 1 to 9 that are not in impossible numbers
  for (let i = 1; i <= 9; i++) {
    if (impos_val.includes(i)) {
      continue;
    } else {
      pos_val.push(i);
    }
  }
  return pos_val;
}

function updatePossibleValuesState() {
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      // If box is not from the template
      if (board1[(i * 9 + j)] === "." && possible_nums_state[j][i].length > 1) {
        possible_nums_state[j][i] = findPossibleValuesForBox(j, i);
      }
    }
  }
  console.log(possible_nums_state);
}

function isSolved() {
  let solved = true;
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      if (possible_nums_state[j][i].length !== 1 || state[j][i] === 0) {
        solved = false;
        return solved;
      }
    }
  }
  return solved
}

function clog() {
  console.log(findPossibleValuesForBox(3, 2));
}

// Given x and y of a box
// Calculates top left coors of it's subgrid
function topLeftCoorsOfSubgrid(x, y) {
  // Top left x of subgrid
  let top_left_x = null;
  // top left y
  let top_left_y = null;

  // Check which subgrid
  if (x < 3) {
    top_left_x = 0;
  } else if (x < 6 && x > 2) {
    top_left_x = 3;
  } else {
    top_left_x = 6;
  }
  if (y < 3) {
    top_left_y = 0;
  } else if (y < 6 && y > 2) {
    top_left_y = 3;
  } else {
    top_left_y = 6;
  }
  return [top_left_x, top_left_y];
}

function boxClick(id) {
  // If clicked but is set
  if (clicked_but !== null) {
    let prev_box = document.getElementById(clicked_but);
    prev_box.style.backgroundColor = "white";
  }
  clicked_but = id;
  let element = document.getElementById(id);
  element.style.backgroundColor = "rgb(199, 255, 203)";
}

function numChoice(id) {
  // Every id starts with "num" so slice the "num" away
  // To get only coordinates
  let num = parseInt(id.slice(3));

  if (clicked_but) {
    let box = document.getElementById(clicked_but);

    // If clicked_but is part of the template, do nothing
    // They have gray text
    if (box.style.color === "gray") {
      return;
    }

    // Set value
    box.value = num;
    box.style.fontWeight = "bold";

    // Remove the background color on box
    box.style.backgroundColor = "white";

    // Update state
    state[clicked_but[3]][clicked_but[4]] = num;

    // Clear clicked_but state
    clicked_but = null;
  }
  console.log("state", state);
}

function deleteNum() {
  if (clicked_but !== null) {
    let element = document.getElementById(clicked_but);
    if (element.style.color !== 'gray') {
      element.value = null;
      state[clicked_but[3]][clicked_but[4]] = 0;
    }
  }
}

// Draw a table
const drawTable = (state) => {
  var sudoku_table = "<table  cellspacing='0' cellpadding='0'><tbody>";

  /*
Each button has a unique id.
id[0] is the x coordinates
id[1] is the y coordinates
*/

  for (let i = 0; i <= 8; i++) {
    sudoku_table += "<tr>";
    for (let j = 0; j <= 8; j++) {
      let frag =
        "<td><input type='button' value='' id='num" +
        j.toString() +
        i.toString() +
        "' onclick='boxClick(id)'></button></td>";

      sudoku_table += frag;
    }
    sudoku_table += "</tr>";
  }

  sudoku_table += "</tbody></table>";

  document.getElementById("game").innerHTML += sudoku_table;
};

drawTable(state);


/*
HERE ARE THE FUNCTIONS TO SOLVE THE BOARD
*/

function solveBoard() {
  shrinkBoard();
}

const shrinkBoard = async () => {
  let board_solved = false;
  while (board_solved === false) {
    for (let i = 0; i <= 8; i++) {
      for (let j = 0; j <= 8; j++) {
        let id = 'num' + j.toString() + i.toString();
        let element = document.getElementById(id);
  
        // If it is part of the template
        if (element.style.color === 'gray') {
          continue;
        } else {
          if (possible_nums_state[j][i].length === 1) {
            console.log('yes!');
            let only_pos_value = possible_nums_state[j][i][0];
            state[j][i] = only_pos_value;
            element.value = only_pos_value;
          }
        }
      }
    }
    updatePossibleValuesState();
    board_solved = isSolved();
    console.log(board_solved, possible_nums_state);
  }
}



function bruteForceSearch() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

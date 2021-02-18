/*
#########################################################
#########################################################
STATE
#########################################################
#########################################################
*/
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
var randomTemplate = null;

/*
#########################################################
#########################################################
FUNCTIONS FOR PLAYING THE GAME
#########################################################
#########################################################
*/

const resetBoard = () => {
  window.clearInterval(moveInterval);
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
        box.style.color = 'black';
        box.style.fontWeight = 'normal';
        box.style.backgroundColor = 'white';
    }
  }
}

const resetGame = () => {
  resetBoard();
  loadGame(true);
}



// Loads a template to the game board
const loadGame = (resetGame=false) => {
  resetBoard();

  // When reseting the game we don't want it to choose a new random template
  if (!resetGame) {
    var template = listOfTemplates[Math.floor(Math.random() * listOfTemplates.length)];   
    randomTemplate = template; 
  }

  // Index to get numbers from the board template
  let b_index = 0;

  // j is the x coor of state
  // i is the y coor of state
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      // If box is not empty on the template
      if (randomTemplate[b_index] !== '0') {
        // Update the state
        state[j][i] = parseInt(randomTemplate[b_index]);

        // Update possibility lists
        possible_nums_state[j][i] = [parseInt(randomTemplate[b_index])];

        // Change button value on screen
        let box_id = "num" + j.toString() + i.toString();
        let box = document.getElementById(box_id);
        box.value = state[j][i];

        // Color determines if it is part of the template or not
        box.style.color = "gray";
      }
      b_index += 1;
    }
  }
  updatePossibleValuesState();
}

// Calculates possible values for every square and stores it in possible_nums_state
const updatePossibleValuesState = () => {
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      // If box is not from the template
      if (randomTemplate[(i * 9 + j)] === "0" && possible_nums_state[j][i].length > 1) {
        possible_nums_state[j][i] = findPossibleValuesForBox(j, i);
      }
    }
  }
}

// Checks if the puzzle is solved
const isSolved = () => {
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

const isSolvable = () => {
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      if (possible_nums_state[j][i].length < 1) {
        return false;
      }
    }
  }
  return true;
}

// Given x and y of a box
// Calculates top left coors of it's subgrid
const topLeftCoorsOfSubgrid = (x, y) => {
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

// Handles clicking a box
const boxClick = (id) => {
  // If clicked but is set
  if (clicked_but !== null) {
    let prev_box = document.getElementById(clicked_but);
    prev_box.style.backgroundColor = "white";
  }
  clicked_but = id;
  let element = document.getElementById(id);
  element.style.backgroundColor = "#cee1fd";
}

// Handles when user chooses a number for the square
const numChoice = (id) => {
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

const deleteNum = () => {
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
#########################################################
#########################################################
HERE ARE THE FUNCTIONS TO SOLVE THE BOARD
#########################################################
#########################################################
*/

// States
var moves = [];
var move1 = {};
var move2 = {};
var moveInterval = null;

const shrinkButPress = () => {
  window.clearInterval(moveInterval);
  shrinkBoard();
}

// Solve the board slowly
const solveButPress = () => {
  window.clearInterval(moveInterval);
  moves = [];
  resetGame();
  let solving_speed_input = document.getElementById("solvingSpeedRange").value;
  let solving_speed = 110 - solving_speed_input;
  visualizeSolving();
  moveInterval = window.setInterval(makeMove, [solving_speed]);
}

// Solve the board as fast as possible
const solve2ButPress = () => {
  window.clearInterval(moveInterval);
  resetGame();
  solveBoard();
}

// Solve the board but instead of updating the board
// Save the moves in moves
const visualizeSolving = () => {
  // Get coordinates of first empty box
  let empty_box = emptyBox();

  // If box.length === 0 this means that the board is full
  if (empty_box.length === 0) {
    return true;
  } else {
  var x_coor = empty_box[0];
  var y_coor = empty_box[1];
  }

  for (let num = 1; num <= 9; num++) {
    let possible_values = findPossibleValuesForBox(x_coor, y_coor);
    if (possible_values.includes(num)) {
      state[x_coor][y_coor] = num;
      // Update the element
      let id = 'num' + x_coor.toString() + y_coor.toString();

      move1 = {
        id: id,
        num: num
      }
      moves.push(move1);

      if (visualizeSolving() === true) {
        return true;
      }

      state[x_coor][y_coor] = 0;
      move2 = {
        id: id,
        num: 0
      }
      moves.push(move2);
    }
  }
  return false;
}

// Make first move in moves
const makeMove = () => {
  if (moves.length > 0) {

    let move = moves[0];

    let id = move.id;
    let num = move.num;
    let element = document.getElementById(id);
    if (num !== 0) {
      element.value = num;      
    } else {
      element.value = null;
    }


    moves.shift();
  } else {
    window.clearInterval(moveInterval);
  }
}

// Solve as fast as possible
const solveBoard = () => {
  // Get coordinates of first empty box
  let empty_box = emptyBox();

  // If box.length === 0 this means that the board is full
  if (empty_box.length === 0) {
    return true;
  } else {
  var x_coor = empty_box[0];
  var y_coor = empty_box[1];
  }

  for (let num = 1; num <= 9; num++) {
    let possible_values = findPossibleValuesForBox(x_coor, y_coor);
    if (possible_values.includes(num)) {
      // Update the state
      state[x_coor][y_coor] = num;
      // Update the element
      let id = 'num' + x_coor.toString() + y_coor.toString();
      let element = document.getElementById(id);
      element.value = num;

      if (solveBoard() === true) {
        return true;
      }

      // backtrack
      state[x_coor][y_coor] = 0;
      element.value = '';
    }
  }
  return false;
}

// If there are any boxes where there can only be 1 possible value
// It solves them
const shrinkBoard = () => {
  // Copy the state
  let continue_shrinking = true;
  let count = 0;
  while (continue_shrinking === true) {
    let state_copy = JSON.parse(JSON.stringify(state));
    for (let i = 0; i <= 8; i++) {
      for (let j = 0; j <= 8; j++) {

        let id = 'num' + j.toString() + i.toString();
        let element = document.getElementById(id);
  
        // If it is part of the template
        if (element.style.color === 'gray') {
          continue;
        } else {
          if (possible_nums_state[j][i].length === 1) {

            let only_pos_value = possible_nums_state[j][i][0];
            if (state[j][i] !== only_pos_value) {
              state[j][i] = only_pos_value;
              element.value = only_pos_value; 
            }

          }
        }
      }
    }
    updatePossibleValuesState();
    if (state === state_copy || isSolved()) {
      continue_shrinking = false;
    }
    count += 1;
    if (count >= 500) {
      continue_shrinking = false;
    }
  }
}

// Finds the first possible empty box
const emptyBox = () => {
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      if (state[j][i] === 0) {
        return [j, i];
      }      
    }
  }
  return [];
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const findPossibleValuesForBox = (x, y) => {
  if (x === undefined) { return; }
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

const printPossibleValues = () => {
  for (let i = 0; i <= 8; i++) {
    let line = '';
    for (let j = 0; j <= 8; j++) {
      let box = possible_nums_state[j][i];
      for (let k = 9; k >= 0; k--) {
        if (box[k]) {
          line += box[k];
        } 
        else if (k === 9) {
          line += '|';
        } else {
          line += ' ';
        }
      }
    }
  }
}

/*
#########################################################
#########################################################
Templates
#########################################################
#########################################################
*/

const template01 = `003020600900305001001806400008102900700000008006708200002609500800203009005010300`
const template02 = `200080300060070084030500209000105408000000000402706000301007040720040060004010003`
const template03 = `000000907000420180000705026100904000050000040000507009920108000034059000507000000`
const template04 = `030050040008010500460000012070502080000603000040109030250000098001020600080060020`
const template05 = `020810740700003100090002805009040087400208003160030200302700060005600008076051090`
const template06 = `100920000524010000000000070050008102000000000402700090060000000000030945000071006`
const template07 = `043080250600000000000001094900004070000608000010200003820500000000000005034090710`
const template08 = `480006902002008001900370060840010200003704100001060049020085007700900600609200018`
const template09 = `000900002050123400030000160908000000070000090000000205091000050007439020400007000`
const template10 = `001900003900700160030005007050000009004302600200000070600100030042007006500006800`
const template11 = `000125400008400000420800000030000095060902010510000060000003049000007200001298000`
const template12 = `062340750100005600570000040000094800400000006005830000030000091006400007059083260`
const template13 = `300000000005009000200504000020000700160000058704310600000890100000067080000005437`
const template14 = `630000000000500008005674000000020000003401020000000345000007004080300902947100080`
const template15 = `000020040008035000000070602031046970200000000000501203049000730000000010800004000`
const template16 = `361025900080960010400000057008000471000603000259000800740000005020018060005470329`
const template17 = `050807020600010090702540006070020301504000908103080070900076205060090003080103040`
const template18 = `080005000000003457000070809060400903007010500408007020901020000842300000000100080`
const template19 = `003502900000040000106000305900251008070408030800763001308000104000020000005104800`
const template20 = `000000000009805100051907420290401065000000000140508093026709580005103600000000000`
const template21 = `020030090000907000900208005004806500607000208003102900800605007000309000030020050`
const template22 = `005000006070009020000500107804150000000803000000092805907006000030400010200000600`
const template23 = `040000050001943600009000300600050002103000506800020007005000200002436700030000040`
const template24 = `004000000000030002390700080400009001209801307600200008010008053900040000000000800`
const template25 = `360020089000361000000000000803000602400603007607000108000000000000418000970030014`
const template26 = `500400060009000800640020000000001008208000501700500000000090084003000600060003002`
const template27 = `007256400400000005010030060000508000008060200000107000030070090200000004006312700`
const template28 = `000000000079050180800000007007306800450708096003502700700000005016030420000000000`
const template29 = `030000080009000500007509200700105008020090030900402001004207100002000800070000090`
const template30 = `200170603050000100000006079000040700000801000009050000310400000005000060906037002`
const template31 = `000000080800701040040020030374000900000030000005000321010060050050802006080000000`
const template32 = `000000085000210009960080100500800016000000000890006007009070052300054000480000000`
const template33 = `608070502050608070002000300500090006040302050800050003005000200010704090409060701`
const template34 = `050010040107000602000905000208030501040070020901080406000401000304000709020060010`
const template35 = `053000790009753400100000002090080010000907000080030070500000003007641200061000940`
const template36 = `006080300049070250000405000600317004007000800100826009000702000075040190003090600`
const template37 = `005080700700204005320000084060105040008000500070803010450000091600508007003010600`
const template38 = `000900800128006400070800060800430007500000009600079008090004010003600284001007000`
const template39 = `000080000270000054095000810009806400020403060006905100017000620460000038000090000`
const template40 = `000602000400050001085010620038206710000000000019407350026040530900020007000809000`
const template41 = `000900002050123400030000160908000000070000090000000205091000050007439020400007000`
const template42 = `380000000000400785009020300060090000800302009000040070001070500495006000000000092`
const template43 = `000158000002060800030000040027030510000000000046080790050000080004070100000325000`
const template44 = `010500200900001000002008030500030007008000500600080004040100700000700006003004050`
const template45 = `080000040000469000400000007005904600070608030008502100900000005000781000060000010`
const template46 = `904200007010000000000706500000800090020904060040002000001607000000000030300005702`
const template47 = `000700800006000031040002000024070000010030080000060290000800070860000500002006000`
const template48 = `001007090590080001030000080000005800050060020004100000080000030100020079020700400`
const template49 = `000003017015009008060000000100007000009000200000500004000000020500600340340200000`
const template50 = `300200000000107000706030500070009080900020004010800050009040301000702000000008006`

const listOfTemplates = [
  template01,
  template02,
  template03,
  template04,
  template05,
  template06,
  template07,
  template08,
  template09,
  template10,
  template11,
  template12,
  template13,
  template14,
  template15,
  template16,
  template17,
  template18,
  template19,
  template20,
  template21,
  template22,
  template23,
  template24,
  template25,
  template26,
  template27,
  template28,
  template29,
  template30,
  template31,
  template32,
  template33,
  template34,
  template35,
  template36,
  template37,
  template38,
  template39,
  template40,
  template41,
  template42,
  template43,
  template44,
  template45,
  template46,
  template47,
  template48,
  template49,
  template50
]
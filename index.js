// Board state
// First create an empty list and then populate it with a board
var state = [];

for (let i = 0; i <= 8; i++) {
  let row = [];
  for (let j = 0; j <= 8; j++) {
    row.push(0);
  }
  state.push(row);
}

// Draw a table
const drawTable = () => {
  var sudoku_table = "<table  cellspacing='0' cellpadding='0'><tbody>";
  /*
Each button has a unique id.
id[0] is the x coordinates
id[1] is the y coordinates
*/
  for (let i = 0; i <= 8; i++) {
    sudoku_table += "<tr>";
    for (let j = 0; j <= 8; j++) {
      let frag = "";
      frag =
        "<td><button id='" +
        j.toString() +
        i.toString() +
        "'>" +
        "</button></td>";
      sudoku_table += frag;
    }
    sudoku_table += "</tr>";
  }

  sudoku_table += "</tbody></table>";

  document.getElementById("game").innerHTML += sudoku_table;
};

drawTable();

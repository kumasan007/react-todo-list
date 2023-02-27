import { Box } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export const Header = (): JSX.Element => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">ToDoアプリ</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
// if (document.getElementById("header")) {
//   ReactDOM.render(<Header />, document.getElementById("header"));
// }

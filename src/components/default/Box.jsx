import { Box as MuiBox } from "@mui/material";

const Box = (props) => {
  return <MuiBox {...props}>{props.children}</MuiBox>;
};
export default Box;

import { Rating as MuiRating } from "@mui/material";

const Rating = (props) => {
  return <MuiRating {...props}>{props.children}</MuiRating>;
};
export default Rating;

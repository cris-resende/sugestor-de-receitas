import { Snackbar as MuiSnackbar } from '@mui/material';

const Snackbar = (props) => {
	return <MuiSnackbar {...props}>{props.children}</MuiSnackbar>
};
export default Snackbar;
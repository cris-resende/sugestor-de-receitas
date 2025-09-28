import { Button as MuiButton} from '@mui/material';

const Button = ({children}) => {
	return (
		<MuiButton>{children}</MuiButton>
	);
};
export default Button;
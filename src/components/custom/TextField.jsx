import { TextField as TextFieldMui } from '@mui/material';

const TextField = (props) => {
	return <TextFieldMui {...props}>{props.children}</TextFieldMui>
};
export default TextField;
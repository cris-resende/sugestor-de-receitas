import { CardContent as CardContentMui } from '@mui/material';

const CardContent = (props) => {
	return <CardContentMui {...props}>{props.children}</CardContentMui>
};
export default CardContent;
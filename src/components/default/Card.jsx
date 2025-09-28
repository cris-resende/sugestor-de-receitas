import { Card as CardMui} from '@mui/material';

const Card = (props) => {
	return <CardMui {...props}>{props.children}</CardMui>
};

export default Card;
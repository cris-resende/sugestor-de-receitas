import {CardActions as CardACtionsMui} from '@mui/material';

const CardActions = () => {
	return <CardACtionsMui {...props}>{props.children}</CardACtionsMui>
};
export default CardActions;

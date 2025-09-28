import { Card as CardMui, CardActions as CardACtionsMui, CardContent as CardContentMui } from '@mui/material';

const Card = (props) => {
	return <CardMui {...props}>{props.children}</CardMui>
};

const CardActions = () => {
	return <CardActionsMui {...props}>{props.children}</CardActionsMui>
};

const CardContent = (props) => {
	return <CardContentMui {...props}>{props.children}</CardContentMui>
};

export default { Card, CardActions, CardContent };
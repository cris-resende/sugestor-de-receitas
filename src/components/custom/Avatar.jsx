import { Avatar as MuiAvatar } from '@mui/material';

const Avatar = (props) => {
	return <MuiAvatar {...props}>{props.children}</MuiAvatar>
};
export default Avatar;
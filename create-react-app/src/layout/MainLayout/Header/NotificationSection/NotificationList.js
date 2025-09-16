// material-ui
import { useTheme } from '@mui/material/styles';
import {


  List,


} from '@mui/material';


const NotificationList = () => {
  const theme = useTheme();


  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
     
    </List>
  );
};

export default NotificationList;

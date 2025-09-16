// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import {
//   Avatar,
//   Chip,
//   Typography,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   List,
//   Popover,
//   Paper,
//   ClickAwayListener,
//   Box,
// } from '@mui/material';
// import { IconLogout } from '@tabler/icons';
// import axios from 'axios';
// import User1 from './profile.jpg';

// const ProfileSection = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');

//   const handleLogout = async () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userFirstName');
//     navigate('/pages/login/login3');
//   };

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const accessToken = localStorage.getItem('accessToken');
//         const response = await axios.get('http://164.52.197.111:8003/users/me', {
//           headers: { Authorization: `Bearer ${accessToken}` }
//         });
//         setFirstName(response.data.first_name); // Assuming the API returns a field named 'first_name'
//         setLastName(response.data.last_name);   // Assuming the API returns a field named 'last_name'
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       {firstName && lastName && (
//         <Typography variant="subtitle1" sx={{ mr: 1 }}>
//           Welcome, {firstName} {lastName}!
//         </Typography>
//       )}

//       <Chip
//         sx={{
//           height: '48px',
//           alignItems: 'center',
//           borderRadius: '27px',
//           transition: 'all .2s ease-in-out',
//           borderColor: theme.palette.primary.light,
//           backgroundColor: theme.palette.primary.light,
//           '&[aria-controls="menu-list-grow"], &:hover': {
//             borderColor: theme.palette.primary.main,
//             background: `${theme.palette.primary.main}!important`,
//             color: theme.palette.primary.light,
//             '& svg': {
//               stroke: theme.palette.primary.light,
//             },
//           },
//           '& .MuiChip-label': {
//             lineHeight: 0,
//           },
//         }}
//         icon={
//           <Avatar
//             src={User1}
//             sx={{
//               ...theme.typography.mediumAvatar,
//               margin: '8px 0 8px 8px !important',
//               cursor: 'pointer',
//             }}
//             aria-describedby={id}
//             onClick={handleClick}
//             color="inherit"
//           />
//         }
//         color="primary"
//       />

//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <Paper>
//           <ClickAwayListener onClickAway={handleClose}>
//             <List>
//               <ListItemButton onClick={handleLogout}>
//                 <ListItemIcon>
//                   <IconLogout />
//                 </ListItemIcon>
//                 <ListItemText primary="Logout" />
//               </ListItemButton>
//             </List>
//           </ClickAwayListener>
//         </Paper>
//       </Popover>
//     </Box>
//   );
// };

// export default ProfileSection;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Chip,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Popover,
  Paper,
  ClickAwayListener,
} from '@mui/material';
import { IconLogout } from '@tabler/icons';
import User1 from './profile.jpg';

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFirstName');
    navigate('/pages/login/login3');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Typography variant="subtitle1" sx={{ mr: 1 }}>
        Welcome,4CT!
      </Typography>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light,
            },
          },
          '& .MuiChip-label': {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            src={User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
            }}
            aria-describedby={id}
            onClick={handleClick}
            color="inherit"
          />
        }
        color="primary"
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <List>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <IconLogout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </ClickAwayListener>
        </Paper>
      </Popover>
    </>
  );
};

export default ProfileSection;

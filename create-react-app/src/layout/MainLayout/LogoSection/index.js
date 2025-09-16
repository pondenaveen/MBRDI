// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { ButtonBase } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import logoImage from './sdt.png';
// import { MENU_OPEN } from 'store/actions';

// const LogoSection = () => {
//   const [role, setRole] = useState('');
//   const defaultId = useSelector((state) => state.customization.defaultId);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const accessToken = localStorage.getItem('accessToken');
//         const response = await axios.get('http://164.52.197.111:8003/users/me', {
//           headers: { Authorization: `Bearer ${accessToken}` }
//         });
//         setRole(response.data.role);
//       } catch (error) {
//         console.error('Error fetching user role:', error);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   const handleLogoClick = () => {
//     dispatch({ type: MENU_OPEN, id: defaultId });

//     if (role === 'Admin') {
//       navigate('/dashboard/default');
//     } else if (role === 'User') {
//       navigate('/dashboard2/default');
//     } else {
//       navigate('/'); // Fallback to home or any default route
//     }
//   };

//   return (
//     <ButtonBase disableRipple onClick={handleLogoClick}>
//       <img src={logoImage} alt="Logo" style={{ width: '80px' }} />
//     </ButtonBase>
//   );
// };

// export default LogoSection;



import React, { useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import axios from 'axios';
import logoImage from './sdt.png';

const LogoSection = () => {


  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const handleLogoClick = () => {
    // Navigate to external link when logo is clicked
    window.location.href = 'http://sdb-services.sdb.net.s3-website.ap-south-2.amazonaws.com/';
  };

  return (
    <ButtonBase disableRipple onClick={handleLogoClick}>
      <img src={logoImage} alt="Logo" style={{ width: '80px' }} />
    </ButtonBase>
  );
};

export default LogoSection;

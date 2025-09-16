// import React from 'react';
// import { Typography, Stack } from '@mui/material';

// import './Cards.css';

// const AuthFooter = () => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <Stack direction="row" justifyContent="space-between">
//       <Typography variant="subtitle2" target="_blank" underline="hover">
//         SmartDigiBuild <b>©</b> {currentYear}
//       </Typography>
//       <Typography variant="subtitle2" target="_blank" underline="hover">
//         {/* Developed by ❤️ Four Corners Technologies Pvt Ltd */}
//         Developed by 💜 Four Corners Technologies Pvt Ltd
//       </Typography>
//     </Stack>
//   );
// };

// export default AuthFooter;



// import React from 'react';
// import { Typography, Stack } from '@mui/material';
//
// import './Cards.css';
//
// const AuthFooter = () => {
//   const currentYear = new Date().getFullYear();
//
//   return (
//     <Stack direction="row" justifyContent="center" alignItems="center" className="auth-footer">
//       <Typography className="foot" variant="subtitle2" target="_blank">
//         4CT <b>©</b> {currentYear}
//       </Typography>
//       <Typography className="foot" variant="subtitle2" target="_blank" sx={{ ml: 2 }}>
//         Developed by Four Corners Technologies Pvt Ltd
//         {/* Developed by 💜 Four Corners Technologies Pvt Ltd */}
//       </Typography>
//     </Stack>
//   );
// };
//
// export default AuthFooter;





import React from 'react';
import { Typography, Stack } from '@mui/material';

import './Cards.css';

const AuthFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Stack direction="row" justifyContent="center" alignItems="center" className="auth-footer">
            <Typography className="foot" variant="subtitle2" target="_blank">
                4CT <b>©</b> {currentYear}
            </Typography>
            <Typography className="foot" variant="subtitle2" target="_blank" sx={{ ml: 2 }}>
                <a href="https://www.fourcorners.asia/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Developed by Four Corners Technologies Pvt Ltd
                </a>
                {/* Developed by 💜 Four Corners Technologies Pvt Ltd */}
            </Typography>

        </Stack>
    );
};

export default AuthFooter;

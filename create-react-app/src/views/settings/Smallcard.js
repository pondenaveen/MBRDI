// import React from 'react';
// import { styled } from '@mui/material/styles';
// import { Box, Typography } from '@mui/material';
// import MainCard from 'ui-component/cards/MainCard';

// // Styled component for the SmallCard
// const StyledSmallCard = styled(MainCard)(() => ({
//     backgroundColor: '#f5f5f5', // Card background color
//     color: '#000', // Default text color
//     height: '130px', // Height of the card
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: '4px',
//     boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//     position: 'relative', // Relative positioning for layering
// }));

// const Smallcard = ({ title, additionalContent, bgColor, textColor }) => {
//     return (
//         <StyledSmallCard>
//             {/* Title background box */}
//             <Box
//                 sx={{
//                     position: 'absolute',
//                     top: 0, // Align to the top of the card
//                     left: 0,
//                     right: 0,
//                     backgroundColor: bgColor || 'rgb(255, 165, 0)',
//                     color: textColor, // Use bgColor prop or default to orange
//                     zIndex: 1, // Ensure it sits above other content
//                 }}
//             >
//                 <Typography sx={{ textAlign: 'center', color: textColor || '#fff', p: 1 }}>
//                     {title}
//                 </Typography>
//             </Box>
//             {/* Main content of the card */}
//             <Box sx={{ position: 'relative', zIndex: 0 }}>
//                 <Typography sx={{ fontSize: '26px', mt: 2 }}>{additionalContent}</Typography>
//             </Box>
//         </StyledSmallCard>
//     );
// };

// export default Smallcard;


// import React from 'react';
// import { styled } from '@mui/material/styles';
// import { Box, Typography } from '@mui/material';
// import MainCard from 'ui-component/cards/MainCard';

// // Styled component for the SmallCard
// const StyledSmallCard = styled(MainCard)(() => ({
//     backgroundColor: '#f5f5f5', // Card background color
//     color: '#000', // Default text color
//     height: '130px', // Height of the card
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: '4px',
//     boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//     position: 'relative', // Relative positioning for layering
// }));

// const Smallcard = ({ title, additionalContent, bgColor, textColor, contentTextColor }) => {
//     return (
//         <StyledSmallCard>
//             {/* Title background box */}
//             <Box
//                 sx={{
//                     position: 'absolute',
//                     top: 0, // Align to the top of the card
//                     left: 0,
//                     right: 0,
//                     backgroundColor: bgColor || 'rgb(255, 165, 0)',
//                     zIndex: 1, // Ensure it sits above other content
//                 }}
//             >
//                 <Typography sx={{ textAlign: 'center', color: textColor || '#fff', p: 1 }}>
//                     {title}
//                 </Typography>
//             </Box>
//             {/* Main content of the card */}
//             <Box sx={{ position: 'relative', zIndex: 0 }}>
//                 <Typography sx={{ fontSize: '26px', mt: 2, color: contentTextColor || 'orange' }}>
//                     {additionalContent}
//                 </Typography>
//             </Box>
//         </StyledSmallCard>
//     );
// };

// export default Smallcard;


import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// Styled component for the SmallCard
const StyledSmallCard = styled(MainCard)(() => ({
    backgroundColor: '#f5f5f5', // Card background color
    color: '#000', // Default text color
    height: '130px', // Height of the card
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative', // Relative positioning for layering
}));

const Smallcard = ({ title, additionalContent, bgColor = 'rgb(165, 244, 8)', textColor = '#fff', }) => {
    return (
        <StyledSmallCard>
            {/* Title background box */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0, // Align to the top of the card
                    left: 0,
                    right: 0,
                    backgroundColor: bgColor, // Default to orange
                    zIndex: 1, // Ensure it sits above other content
                    padding: '8px 0', // Add padding for better appearance
                }}
            >
                <Typography sx={{ textAlign: 'center', color: textColor }}>
                    {title}
                </Typography>
            </Box>
            {/* Main content of the card */}
            <Box sx={{ position: 'relative', zIndex: 0, marginTop: 3 }}>
                <Typography sx={{ fontSize: '26px', color: 'orange' }}>
                    {additionalContent}
                </Typography>
            </Box>
        </StyledSmallCard>
    );
};

export default Smallcard;

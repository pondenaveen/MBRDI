// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Grid, IconButton, Popover } from '@mui/material';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import api from './api.js';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// const Temp = () => {
//   const [temperature, setTemperature] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('/integration/iaq');
//         setTemperature(response.data.Temp);
//       } catch (error) {
//         console.error("There was an error fetching the data!", error);
//       }
//     };

//     fetchData();
//     const intervalId = setInterval(fetchData, 60000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const getStatus = () => {
//     if (temperature === null) return { status: 'Loading', color: 'grey' };
//     if (temperature < 20) return { status: 'Cold', color: '#29BA76', gif: '/rain.webp' };
//     if (temperature <= 24) return { status: 'Green', color: '#29BA76', gif: '/rain.webp' };
//     if (temperature <= 26) return { status: 'Moderate', color: 'rgb(165, 244, 8)', gif: '/rain.webp' };
//     if (temperature <= 27) return { status: 'Unhealthy if sensitive', color: '#EA8232', gif: '/rain.webp' };
//     if (temperature <= 30) return { status: 'Unhealthy', color: '#F33C42', gif: '/rain.webp' };
//     return { status: 'Hazardous', color: '#510B36', gif: '/rain.webp' };
//   };

//   const { status, color, gif } = getStatus();

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;

//   return (
//     <Box sx={{
//       position: 'relative',
//       backgroundColor: 'white',
//       height: '250px',
//       padding: 2,
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRadius: '8px',
//       backgroundImage: `url(${gif})`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//     }}>
//       <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleClick}>
//         <InfoOutlinedIcon />
//       </IconButton>

//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'left',
//         }}
//       >
//         <Box sx={{ p: 2 }}>
//           <Grid container direction="column" spacing={1}>
//             {/* Popover content here */}
//           </Grid>
//         </Box>
//       </Popover>

//       <Typography variant="h5" sx={{ marginBottom: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>Temperature</Typography>
//       <div style={{ width: 150, height: 150 }}>
//         <CircularProgressbar
//           value={(temperature / 40) * 100}
//           text={`${temperature || 0}°C`}
//           styles={buildStyles({
//             pathColor: color,
//             textColor: '#333',
//             trailColor: '#f4f4f4'
//           })}
//         />
//       </div>
//       <Typography variant="body2" style={{
//         marginTop: 2,
//         color: color,
//         backgroundColor: 'rgba(255, 255, 255, 0.8)',
//         fontSize: '25px',
//         fontWeight: 'bold'
//       }}>
//         {status}
//       </Typography>
//     </Box>
//   );
// };

// export default Temp;





import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid,  IconButton, Popover } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from './../../api.js';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Temp = () => {
    const [temperature, setTemperature] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/integration/iaq');
                setTemperature(response.data.Temp);
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const getStatus = () => {
        if (temperature === null) return { status: 'Loading', color: 'grey' };
        if (temperature < 20) return { status: 'Cold', color: '#29BA76' };
        if (temperature <= 24) return { status: 'Grenn', color: '#29BA76' };
        if (temperature <= 26) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
        if (temperature <= 27) return { status: 'Unhealthy if sensitive', color: '#EA8232' };
        if (temperature <= 30) return { status: 'Unhealthy', color: '#F33C42' };
        return { status: 'Hazardous', color: '#510B36' };
    };


    const {  color } = getStatus();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box sx={{
            position: 'relative',
            backgroundColor: 'white',
            height: '120px',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px'

        }}>
            <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleClick}>
                <InfoOutlinedIcon />
            </IconButton>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2 }}>
                <Grid container direction="column" spacing={1}>
    <Grid item container alignItems="center">
        <Grid item xs>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#29BA76', display: 'inline-block', marginRight: 8 }}></span>
                Good
            </Typography>
        </Grid>
        <Grid item>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                20°C - 24°C
            </Typography>
        </Grid>
    </Grid>
    <Grid item container alignItems="center">
        <Grid item xs>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgb(165, 244, 8)', display: 'inline-block', marginRight: 8 }}></span>
                Moderate
            </Typography>
        </Grid>
        <Grid item>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                25°C - 26°C
            </Typography>
        </Grid>
    </Grid>
    <Grid item container alignItems="center">
        <Grid item xs>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EA8232', display: 'inline-block', marginRight: 8 }}></span>
                Unhealthy if sensitive
            </Typography>
        </Grid>
        <Grid item>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                27°C - 27°C
            </Typography>
        </Grid>
    </Grid>
    <Grid item container alignItems="center">
        <Grid item xs>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F33C42', display: 'inline-block', marginRight: 8 }}></span>
                Unhealthy
            </Typography>
        </Grid>
        <Grid item>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                28°C - 30°C
            </Typography>
        </Grid>
    </Grid>
    <Grid item container alignItems="center">
        <Grid item xs>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#510B36', display: 'inline-block', marginRight: 8 }}></span>
                Hazardous
            </Typography>
        </Grid>
        <Grid item>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                Above 30°C
            </Typography>
        </Grid>
    </Grid>
</Grid>

                </Box>
            </Popover>

            <Typography variant="h5" sx={{ marginBottom: 1 }}>Temperature</Typography>
            <div style={{ width: 70, height: 70 }}>
                <CircularProgressbar
                    // value={temperature ? (temperature / limit) * 100 : 0}
                    value={(temperature / 40) * 100}
                    text={`${temperature || 0}°C`}
                    styles={buildStyles({
                        pathColor: color,
                        textColor: '#000',
                        trailColor: '#d6d6d6',
                        textSize: '16px',
                    })}
                />
            </div>
            {/* <Typography variant="body2" style={{
                marginTop: 2, color: color, backgroundColor: 'white',
                fontSize: '25px', fontWeight: 'bold'
            }}>
                {status}
            </Typography> */}
        </Box>
    );
};

export default Temp;

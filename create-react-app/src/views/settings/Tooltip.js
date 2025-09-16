import React from 'react';
import { Tooltip as MuiTooltip, Box, Typography, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const Tooltip = ({ title, ranges }) => {
    return (
        <MuiTooltip
            title={
                <Box sx={{ p: 1, maxWidth: 300 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
                    <Grid container direction="column" spacing={1}>
                        {ranges.map((range, index) => (
                            <Grid item container alignItems="center" key={index}>
                                <Grid item xs>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: range.color, display: 'inline-block', marginRight: 8 }}></span>
                                        {range.label}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                                        {range.range}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            }
        >
            <IconButton size="small" sx={{ ml: 1 }}>
                <InfoOutlinedIcon fontSize="small" />
            </IconButton>
        </MuiTooltip>
    );
};

export default Tooltip;

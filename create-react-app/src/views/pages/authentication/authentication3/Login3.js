import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import AuthWrapper1 from '../AuthWrapper1';
import twin1Logo from './4CT.png';
import AuthLogin from '../auth-forms/AuthLogin';
import './Pages.css';

const Login3 = () => {
  return (
    <AuthWrapper1>
      <Grid container justifyContent="center" alignItems="center" className="background">
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" style={{ height: '100%', marginTop: '200px' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center" justifyContent="center" direction="row">
                <Grid item xs={12}>
                  <CardContent>
                    <img
                      src={twin1Logo}
                      alt="Twin1 Logo"
                      style={{
                        width: '15%',
                        height: '3%',
                        display: 'block',
                        margin: 'auto',
                      }}
                    />
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        marginTop: 3,
                        color: 'black'
                      }}
                    >
                      {/* People Counting */}
                    </Typography>

                    {/* Use the AuthLogin component here */}
                    <AuthLogin onLogin={() => { }} />
                  </CardContent>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          {/* <AuthFooter /> */}
          {/* <Typography> Developed by ❤️ Four Corners Technologies Pvt Ltd</Typography> */}
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login3;

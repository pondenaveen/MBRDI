import React, { useState } from 'react';
import {
  Button, Card, CardContent, Grid, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileSection from './../../../../layout/MainLayout/Header/ProfileSection/index.js';
import ErrorIcon from '@mui/icons-material/Error';
import './Auth.css';

const AuthLogin3 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false); // State to control the error dialog
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      // const response = await axios.post('http://164.52.197.111:8000/users/login', formData, {
      const response = await axios.post('http://164.52.197.111:8003/users/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!response) {
        throw new Error('Network response was not ok');
      }

      const data = response.data;

      if (data.access_token && data.role) {
        console.log("Login successful. Role: ", data.role);

        // Store access token and role in local storage
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('userRole', data.role);

        // Retrieve current user information
        // const userResponse = await axios.get('http://164.52.197.111:8000/users/me', {
        const userResponse = await axios.get('http://164.52.197.111:8003/users/me', {
          headers: { Authorization: `Bearer ${data.access_token}` }
        });

        // Handle user information response
        console.log('User Information:', userResponse.data);
        setFirstName(userResponse.data.first_name);

        // Redirect based on role
        if (data.role === 'Admin') {
          navigate(`/dashboard/default`);
        } else if (data.role === 'User') {
          navigate(`/dashboard2/default`);
        }

        // Refresh the page if necessary
        window.location.reload();
      } else {
        throw new Error('Access token or role not received');
      }
    } catch (error) {
      console.error('Error submitting login:', error);
      setError('Check Username and Password');
      setIsErrorDialogOpen(true); // Open the error dialog
    }
  };

  const handleDialogClose = () => {
    setIsErrorDialogOpen(false); // Close the error dialog
  };

  return (
    <>
      <Card variant="outlined" sx={{ width: '100%', maxWidth: '500px', margin: '50px auto', padding: '16px' }}>
        <CardContent>
          <form id="loginForm" onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label htmlFor="username">Username/Email</label>
                <TextField
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  fullWidth
                  style={{ marginTop: "10px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="password">Password</label>
                <TextField
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  fullWidth
                  style={{ marginTop: "10px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ boxShadow: 'none' }}>
                  Sign In
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography style={{ marginLeft: '50px', marginTop: '15px' }}> Developed by ❤️ Four Corners Technologies Pvt Ltd</Typography>
              </Grid>

              {firstName && (
                <Grid item xs={12}>
                  <ProfileSection firstName={firstName} /> 
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Error Dialog */}
      <Dialog
        open={isErrorDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="error-dialog-title"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '8px',
            border: '1px solid #FF0000', // Keep a simple border for emphasis
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with 50% opacity
          },
        }}
      >
        <DialogTitle
          id="error-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            color: '#333',
            borderBottom: '1px solid #EEE',
            padding: '16px',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          {/* Use Box to align Icon and Text */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ErrorIcon
              sx={{
                fontSize: '2.5rem',
                color: '#D32F2F',
                marginRight: '8px', // Add spacing between icon and text
              }}
            />
            <Typography variant="h2" sx={{ color: '#D32F2F', fontWeight: 'bold' }}>
              Error
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px',
            backgroundColor: 'white',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#333',
              marginBottom: '6px',
              marginTop: '24px',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            {error}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            backgroundColor: 'white', // No background color for actions
          }}
        >
          <Button
            onClick={handleDialogClose}
            variant="outlined" // Outlined style for a minimal look
            className="loginclose"

          >
            Close
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default AuthLogin3;

import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import api from './../../api.js';

const Report = () => {
  const [startDateAlerts, setStartDateAlerts] = useState('');
  const [endDateAlerts, setEndDateAlerts] = useState('');
  const [startDateData, setStartDateData] = useState('');
  const [endDateData, setEndDateData] = useState('');
  const [selectedFloorAlerts, setSelectedFloorAlerts] = useState(''); // State for the selected floor for alerts report
  const [selectedFloorData, setSelectedFloorData] = useState(''); // State for the selected floor for data report

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`; // Convert to DD-MM-YYYY format
  };

  const downloadReportAlerts = async () => {
    try {
      const formattedStartDate = formatDate(startDateAlerts);
      const formattedEndDate = formatDate(endDateAlerts);
      const response = await api.get('/integration/download/alerts/csv', {
        params: { start_date: formattedStartDate, end_date: formattedEndDate, floor: selectedFloorAlerts },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'alerts_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading alerts report:', error);
    }
  };

  const downloadDataReport = async () => {
    try {
      const formattedStartDate = formatDate(startDateData);
      const formattedEndDate = formatDate(endDateData);
      const response = await api.get('/integration/download/data/csv', {
        params: { start_date: formattedStartDate, end_date: formattedEndDate, floor: selectedFloorData },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading data report:', error);
    }
  };

  // Get today's date for restricting future dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <MainCard title="Reports">
      <Card variant="outlined" style={{ margin: '16px' }}>
        <CardContent>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mb: 2 }}>Download Alerts Report</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4}>
              <label htmlFor='floorAlerts'>Select Floor</label>
              <FormControl fullWidth variant="outlined" margin="dense">
                <Select
                  labelId="floor-alerts-select-label"
                  value={selectedFloorAlerts}
                  onChange={(e) => setSelectedFloorAlerts(e.target.value)}
                >
                  <MenuItem value={6}>Floor 1</MenuItem>
                  {/* You can add more floors here as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={4}>
              <label htmlFor='startdate'>Start Date</label>
              <TextField
                margin="dense"
                type="date"
                fullWidth
                variant="outlined"
                value={startDateAlerts}
                onChange={(e) => setStartDateAlerts(e.target.value)}
                inputProps={{ max: today }} // Restrict future dates
                onFocus={(e) => e.target.showPicker()} // Show date picker on focus
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <label htmlFor='enddate'>End Date</label>
              <TextField
                margin="dense"
                type="date"
                fullWidth
                variant="outlined"
                value={endDateAlerts}
                onChange={(e) => setEndDateAlerts(e.target.value)}
                inputProps={{ max: today }} // Restrict future dates
                onFocus={(e) => e.target.showPicker()} // Show date picker on focus
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button sx={{ mt: -2 }} className='alert' size="small" onClick={downloadReportAlerts}>
            Download
          </Button>
        </CardActions>
      </Card>

      <Card variant="outlined" style={{ margin: '16px' }}>
        <CardContent>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mb: 2 }}>Download Data Report</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4}>
              <label htmlFor='floorData'>Select Floor</label>
              <FormControl fullWidth variant="outlined" margin="dense">
                <Select
                  labelId="floor-data-select-label"
                  value={selectedFloorData}
                  onChange={(e) => setSelectedFloorData(e.target.value)}
                >
                  <MenuItem value={6}>Floor 1</MenuItem>
                  {/* You can add more floors here as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={4}>
              <label htmlFor='startdate'>Start Date</label>
              <TextField
                margin="dense"
                type="date"
                fullWidth
                variant="outlined"
                value={startDateData}
                onChange={(e) => setStartDateData(e.target.value)}
                inputProps={{ max: today }} // Restrict future dates
                onFocus={(e) => e.target.showPicker()} // Show date picker on focus
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <label htmlFor='enddate'>End Date</label>
              <TextField
                margin="dense"
                type="date"
                fullWidth
                variant="outlined"
                value={endDateData}
                onChange={(e) => setEndDateData(e.target.value)}
                inputProps={{ max: today }} // Restrict future dates
                onFocus={(e) => e.target.showPicker()} // Show date picker on focus
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button sx={{ mt: -2 }} className='alert' size="small" onClick={downloadDataReport}>
            Download
          </Button>
        </CardActions>
      </Card>
    </MainCard>
  );
}

export default Report;

import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Box
} from '@mui/material';
import api from './../../api.js'; // Assuming this is your API setup

const AlertHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [alertHistoryData, setAlertHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlertHistoryData = async () => {
      try {
        const response = await api.get('/integration/alerts', { // Adjust the endpoint as needed
          params: { skip: page * rowsPerPage, limit: rowsPerPage }
        });
        setAlertHistoryData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch alert history. Please try again.');
        setLoading(false);
      }
    };

    fetchAlertHistoryData();
  }, [page, rowsPerPage]);

  const filteredData = alertHistoryData.filter((alert) =>
    (alert.Device?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (alert.kpi?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (alert.value?.toString() || '').includes(searchText.toLowerCase()) ||
    (alert.zone?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (alert.created_at?.toLowerCase() || '').includes(searchText.toLowerCase())
  );

  const highlightText = (text) => {
    if (!text) return text; // Return as is if text is falsy

    const parts = String(text).split(new RegExp(`(${searchText})`, 'gi'));
    return parts.map((part, index) => (
      part.toLowerCase() === searchText.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
      ) : part
    ));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  return (
    <MainCard title="Alert History">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search History"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: '4px',
              },
            },
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
          <p>Loading...</p>
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
          <p>{error}</p>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: '4px', overflow: 'hidden' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'rgb(236, 236, 236)' }}>
                <TableRow>
                  <TableCell align="center">Device</TableCell>
                  <TableCell align="center">KPI</TableCell>
                  <TableCell align="center">Value</TableCell>
                  <TableCell align="center">Zone</TableCell>
                  <TableCell align="center">Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell align="center">{highlightText(alert.Device || 'null')}</TableCell>
                    <TableCell align="center">{highlightText(alert.kpi || 'null')}</TableCell>
                    <TableCell align="center">{highlightText(alert.value || 'null')}</TableCell>
                    <TableCell align="center">{highlightText(alert.zone || 'null')}</TableCell>
                    <TableCell align="center">{highlightText(alert.created_at || 'null')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={Math.ceil(filteredData.length / rowsPerPage) * rowsPerPage} // Total items for pagination
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10]}
          />
        </>
      )}
    </MainCard>
  );
};

export default AlertHistory;

import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Box
} from '@mui/material';
// import AlertIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import Add_alert from './Add_alert';
import api from './../../api.js';
import EditAlert from './Edit_alert';

const Alert = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const response = await api.get('/integration/ruleengine/all', {
          params: { skip: page * rowsPerPage, limit: rowsPerPage }
        });
        setAlertData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch alerts. Please try again.');
        setLoading(false);
      }
    };

    fetchAlertData();
    const intervalId = setInterval(fetchAlertData, 1000);
    return () => clearInterval(intervalId);
  }, [page, rowsPerPage]);

  const filteredData = alertData.filter((alert) =>
    (alert.kpi?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (alert.operator?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (alert.min_value?.toString() || '').includes(searchText.toLowerCase()) ||
    (alert.max_value?.toString() || '').includes(searchText.toLowerCase()) ||
    (alert.severity?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (alert.device?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (alert.created_at?.toLowerCase() || '').includes(searchText.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (alert) => {
    setCurrentAlert(alert);
    setEditDialogOpen(true);
  };

  // Highlight function
  const highlightText = (text) => {
    if (typeof text !== 'string') {
      return text; // Return original text if it's not a string
    }

    if (!searchText) return text; // Return original text if searchText is empty
    const parts = text.split(new RegExp(`(${searchText})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchText.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
      ) : part
    );
  };

  // Function to display data or 'null' if empty
  const renderCellContent = (content) => {
    if (content === undefined || content === null || content === '') {
      return <span style={{ color: 'lightgray' }}>null</span>;
    }
    return content.toString(); // Ensure the content is returned as a string
  };

  const operatorMapping = {
    '<': 'Less than',
    '>': 'Greater than',
    '<=': 'Less than OR Equal to',
    '>=': 'Greater than OR Equal to',
    '==': 'Equal to',
    '><': 'Not in range',
    '<>': 'In range'
  };

  // Function to render the operator label
  const renderOperatorLabel = (value) => {
    return operatorMapping[value] || value; // Fallback to value if not found in mapping
  };

  return (
    <MainCard title="Rule-Engine Data">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search Rule"
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
        {/* <Box display="flex" gap={2}>
          <Button
            className="alert"
            variant="contained"
            startIcon={<AlertIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Alert
          </Button>
        </Box> */}
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
                  <TableCell align="center">Alert Name</TableCell>
                  <TableCell align="center">Rule</TableCell>
                  <TableCell align="center">Value-1</TableCell>
                  <TableCell align="center">Value-2</TableCell>
                  <TableCell align="center">Severity</TableCell>
                  <TableCell align="center">Timestamp</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell align="center">{highlightText(renderCellContent(alert.kpi))}</TableCell>
                    <TableCell align="center">
                      {highlightText(renderOperatorLabel(alert.operator))}
                    </TableCell>
                    <TableCell align="center">{highlightText(renderCellContent(alert.min_value))}</TableCell>
                    <TableCell align="center">{highlightText(renderCellContent(alert.max_value))}</TableCell>
                    <TableCell align="center">{highlightText(renderCellContent(alert.severity))}</TableCell>
                    <TableCell align="center">{highlightText(renderCellContent(alert.created_at))}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleEdit(alert)}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </>
      )}

      <Add_alert open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <EditAlert open={editDialogOpen} onClose={() => setEditDialogOpen(false)} alertData={currentAlert} />
    </MainCard>
  );
};

export default Alert;

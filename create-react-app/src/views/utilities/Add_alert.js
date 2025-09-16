import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem,
    FormControl, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from './../../api.js';

const Add_alert = ({ open, onClose }) => {
    const [alertName, setAlertName] = useState('');
    const [operator, setOperator] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [minValue, setMinValue] = useState('');
    const [severity, setSeverity] = useState('');
    const navigate = useNavigate();

    const deviceName = 'IAQ-1';
    const kpiOptions = ['CO2', 'Hum', 'pm25', 'pm10', 'TVOC', 'Temp'];
    const operatorOptions = [
        { value: '<', label: 'Less than' },
        { value: '>', label: 'Greater than' },
        { value: '<=', label: 'Less than OR Equal to' },
        { value: '>=', label: 'Greater than OR Equal to' },
        { value: '==', label: 'Equal to' },
        { value: '><', label: 'Not in range' },
        { value: '<>', label: 'In range' }
    ];
    const severityOptions = [
        { value: 'Good', label: 'Good' },
        { value: 'Moderate', label: 'Moderate' },
        { value: 'Unhealthy if Sensitive', label: 'Unhealthy if Sensitive' },
        { value: 'Unhealthy', label: 'Unhealthy' },
        { value: 'Very Unhealthy', label: 'Very Unhealthy' },
        { value: 'Hazardous', label: 'Hazardous' }
    ];

    const isMinDisabled = () => {
        // Disable min value for certain operators
        return operator === '<' || operator === '>' || operator === '<=' || operator === '>=' || operator === '==';
    };

    // const isMaxDisabled = () => {
    //     // Disable max value for >< and <>
    //     return operator === '><' || operator === '<>';
    // };

    const handleAddAlert = async () => {
        const payload = {
            kpi: alertName,
            device: deviceName,
            operator: operator,
            max_value: maxValue,
            min_value: minValue,
            severity: severity,
        };

        try {
            const response = await api.post('/integration/ruleengine', payload);
            console.log('Alert created successfully:', response.data);
            onClose();
            navigate('/utils/util-alerts');
        } catch (error) {
            console.error('Error creating alert:', error);
            // You can display an error message to the user here
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontSize: '25px' }}>Create New Rule</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="dense">
                            <label htmlFor="threshold">Alert Name</label>
                            <Select
                                value={alertName}
                                onChange={(e) => setAlertName(e.target.value)}
                                variant="outlined"
                                fullWidth
                            >
                                {kpiOptions.map((kpi) => (
                                    <MenuItem key={kpi} value={kpi}>
                                        {kpi}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <label htmlFor="minValue">Min Value</label>
                        <TextField
                            margin="dense"
                            type="text"
                            fullWidth
                            value={minValue}
                            onChange={(e) => setMinValue(e.target.value)}
                            disabled={isMinDisabled()} // Disable based on operator
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <label htmlFor="operator">Rule</label>
                        <FormControl fullWidth margin="dense">
                            <Select
                                value={operator}
                                onChange={(e) => setOperator(e.target.value)}
                                variant="outlined"
                                fullWidth
                            >
                                {operatorOptions.map((op) => (
                                    <MenuItem key={op.value} value={op.value}>
                                        {op.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <label htmlFor="maxValue">Max Value</label>
                        <TextField
                            margin="dense"
                            type="text"
                            fullWidth
                            value={maxValue}
                            onChange={(e) => setMaxValue(e.target.value)}
                        // disabled={isMaxDisabled()} // Disable based on operator
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <label htmlFor="severity">Severity</label>
                        <FormControl fullWidth margin="dense">
                            <Select
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                                variant="outlined"
                                fullWidth
                            >
                                {severityOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <label htmlFor="deviceName">Device Name</label>
                        <TextField
                            margin="dense"
                            type="text"
                            fullWidth
                            value={deviceName}
                            disabled // Disable the field
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className="cancel" onClick={onClose}>
                    Cancel
                </Button>
                <Button className="add" onClick={handleAddAlert}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Add_alert;

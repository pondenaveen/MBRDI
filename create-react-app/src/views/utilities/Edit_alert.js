import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    Grid
} from '@mui/material';

import api from './../../api.js';

const EditAlert = ({ open, onClose, alertData }) => {
    const [alertName, setAlertName] = React.useState(alertData?.kpi || '');
    const [threshold, setThreshold] = React.useState(alertData?.value || '');
    const [operator, setOperator] = React.useState(alertData?.operator || '');
    const [maxValue, setMaxValue] = React.useState(alertData?.max_value || '');
    const [minValue, setMinValue] = React.useState(alertData?.min_value || '');
    const [severity, setSeverity] = React.useState(alertData?.severity || '');

    const deviceName = 'IAQ-1';
    const kpiOptions = ['CO2', 'Hum', 'pm25', 'pm10', 'TVOC', 'Temp', 'AQI'];
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
        return operator === '<' || operator === '>' || operator === '<=' || operator === '>=' || operator === '==';
    };

    const isMaxDisabled = () => {
        return operator === '><' || operator === '<>';
    };

    // Handle the form submission
    const handleEditAlert = async () => {
        const payload = {
            kpi: alertName,
            value: threshold,
            operator: operator,
            max_value: maxValue,
            min_value: minValue,
            severity: severity,
            device: deviceName,
        };

        try {
            const response = await api.put(`/integration/ruleengine/${alertData.id}`, payload);
            console.log('Alert updated successfully:', response.data);
            onClose();
            navigate('/utils/util-alerts');
        } catch (error) {
            console.error('Error updating alert:', error);
        }
    };

    React.useEffect(() => {
        if (alertData) {
            setAlertName(alertData.kpi);
            setThreshold(alertData.value);
            setOperator(alertData.operator);
            setMaxValue(alertData.max_value);
            setMinValue(alertData.min_value);
            setSeverity(alertData.severity);
        }
    }, [alertData]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontSize: '25px' }}>Edit Rule</DialogTitle>
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
                            disabled={isMaxDisabled()} // Disable based on operator
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
                <Button className="add" onClick={handleEditAlert}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAlert;

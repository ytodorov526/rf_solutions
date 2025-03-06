import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Chip,
  Button,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import MemoryIcon from '@mui/icons-material/Memory';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import WifiIcon from '@mui/icons-material/Wifi';
import WarningIcon from '@mui/icons-material/Warning';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

function LiveDataMonitor() {
  const theme = useTheme();
  const [isLive, setIsLive] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState({
    connected: true,
    signalStrength: 78,
    battery: 85,
    temperature: 42,
    dataRate: 2.4,
    errors: 0,
    lastUpdate: new Date().toLocaleTimeString()
  });
  const [tabValue, setTabValue] = useState(0);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [historyData, setHistoryData] = useState({
    signal: generateDummyData(50, 60, 90),
    temperature: generateDummyData(50, 35, 50),
    errors: new Array(50).fill(0).map(() => Math.floor(Math.random() * 2))
  });
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Temperature approaching upper threshold', timestamp: '10:32:45' },
    { id: 2, type: 'info', message: 'Signal strength fluctuation detected', timestamp: '10:28:12' }
  ]);

  const intervalRef = useRef(null);

  // Generate dummy data for charts
  function generateDummyData(count, min, max) {
    return new Array(count).fill(0).map(() => min + Math.random() * (max - min));
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Toggle live data monitoring
  const toggleLiveMonitoring = () => {
    setIsLive(!isLive);
  };

  // Toggle alerts
  const handleToggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
  };

  // Clear all alerts
  const clearAlerts = () => {
    setAlerts([]);
  };

  // Export data as CSV
  const exportData = () => {
    alert('Data export initiated. File will be downloaded shortly.');
  };

  // Refresh data manually
  const refreshData = () => {
    updateDeviceData();
  };

  // Update device data
  const updateDeviceData = () => {
    // In a real app, this would fetch data from an API
    const newSignalStrength = Math.max(50, Math.min(95, deviceStatus.signalStrength + (Math.random() - 0.5) * 10));
    const newTemperature = Math.max(35, Math.min(50, deviceStatus.temperature + (Math.random() - 0.5) * 3));
    const newBattery = Math.max(0, Math.min(100, deviceStatus.battery - Math.random() * 0.5));
    const newDataRate = Math.max(1, Math.min(5, deviceStatus.dataRate + (Math.random() - 0.5) * 0.3));
    const newErrors = Math.random() > 0.9 ? deviceStatus.errors + 1 : deviceStatus.errors;
    
    // Update device status
    setDeviceStatus({
      connected: true,
      signalStrength: newSignalStrength,
      battery: newBattery,
      temperature: newTemperature,
      dataRate: newDataRate,
      errors: newErrors,
      lastUpdate: new Date().toLocaleTimeString()
    });
    
    // Update history data
    setHistoryData(prev => ({
      signal: [...prev.signal.slice(1), newSignalStrength],
      temperature: [...prev.temperature.slice(1), newTemperature],
      errors: [...prev.errors.slice(1), Math.random() > 0.9 ? 1 : 0]
    }));
    
    // Add alerts if needed
    if (alertsEnabled) {
      if (newTemperature > 48) {
        addAlert('warning', 'Temperature approaching critical level', new Date().toLocaleTimeString());
      } else if (newSignalStrength < 60) {
        addAlert('warning', 'Signal strength low', new Date().toLocaleTimeString());
      } else if (newBattery < 15) {
        addAlert('warning', 'Battery level critical', new Date().toLocaleTimeString());
      } else if (Math.random() > 0.95) {
        addAlert('info', 'Routine system check completed', new Date().toLocaleTimeString());
      }
    }
  };
  
  // Add a new alert
  const addAlert = (type, message, timestamp) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
      timestamp
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep only last 10 alerts
  };

  // Setup interval for data updates
  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(updateDeviceData, 2000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, deviceStatus, alertsEnabled]);

  // Chart configuration
  const signalChartData = {
    labels: new Array(50).fill('').map((_, i) => i.toString()),
    datasets: [
      {
        label: 'Signal Strength (dBm)',
        data: historyData.signal,
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const temperatureChartData = {
    labels: new Array(50).fill('').map((_, i) => i.toString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historyData.temperature,
        borderColor: theme.palette.error.main,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const errorChartData = {
    labels: new Array(50).fill('').map((_, i) => i.toString()),
    datasets: [
      {
        label: 'Errors',
        data: historyData.errors,
        borderColor: theme.palette.warning.main,
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0,
        fill: true,
        stepped: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false
      },
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    animation: {
      duration: 0 // Disable animations for better performance
    }
  };
  
  const temperatureChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        beginAtZero: false,
        min: 30,
        max: 60
      }
    }
  };
  
  const errorChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        beginAtZero: true,
        min: 0,
        max: 2,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Calculate status color based on value
  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'success';
    if (value >= thresholds.warning) return 'warning';
    return 'error';
  };

  // Render status indicator with appropriate color
  const renderStatusIndicator = (value, type) => {
    let color;
    
    switch (type) {
      case 'signal':
        color = getStatusColor(value, { good: 70, warning: 50 });
        break;
      case 'battery':
        color = getStatusColor(value, { good: 50, warning: 20 });
        break;
      case 'temperature':
        // For temperature, lower is better
        color = getStatusColor(50 - (value - 35), { good: 10, warning: 0 });
        break;
      case 'errors':
        color = value === 0 ? 'success' : 'error';
        break;
      default:
        color = 'primary';
    }
    
    return (
      <LinearProgress
        variant="determinate"
        value={type === 'errors' ? (value === 0 ? 100 : 100 - value * 10) : value}
        color={color}
        sx={{ height: 8, borderRadius: 4, my: 1 }}
      />
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h3">
          RF Device Monitor
        </Typography>
        <Box>
          <Tooltip title={isLive ? "Pause live updates" : "Resume live updates"}>
            <IconButton 
              color="inherit" 
              onClick={toggleLiveMonitoring}
              size="small"
              sx={{ mr: 1 }}
            >
              {isLive ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh data now">
            <IconButton 
              color="inherit" 
              onClick={refreshData}
              size="small"
              sx={{ mr: 1 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export data">
            <IconButton 
              color="inherit" 
              onClick={exportData}
              size="small"
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Device Status Panel */}
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <Grid container spacing={3}>
          {/* Overall Device Status */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader 
                title="Device Status" 
                subheader={`Last updated: ${deviceStatus.lastUpdate}`}
                action={
                  <Tooltip title="Connection status">
                    <Chip 
                      label={deviceStatus.connected ? "Connected" : "Disconnected"} 
                      color={deviceStatus.connected ? "success" : "error"}
                      size="small"
                    />
                  </Tooltip>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SignalCellularAltIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">Signal Strength</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">{deviceStatus.signalStrength} dBm</Typography>
                      </Box>
                      {renderStatusIndicator(deviceStatus.signalStrength, 'signal')}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BatteryFullIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">Battery Level</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">{deviceStatus.battery.toFixed(1)}%</Typography>
                      </Box>
                      {renderStatusIndicator(deviceStatus.battery, 'battery')}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ThermostatIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">Temperature</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">{deviceStatus.temperature.toFixed(1)}°C</Typography>
                      </Box>
                      {renderStatusIndicator(deviceStatus.temperature, 'temperature')}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SpeedIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">Data Rate</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">{deviceStatus.dataRate.toFixed(1)} Mbps</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={deviceStatus.dataRate * 20} // Scale to 0-100%
                        color="primary"
                        sx={{ height: 8, borderRadius: 4, my: 1 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Alerts Panel */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader 
                title="System Alerts" 
                action={
                  <Box>
                    <FormGroup>
                      <FormControlLabel 
                        control={
                          <Switch 
                            checked={alertsEnabled} 
                            onChange={handleToggleAlerts} 
                            size="small"
                          />
                        } 
                        label="Alerts"
                        sx={{ mr: 1 }}
                      />
                    </FormGroup>
                  </Box>
                }
              />
              <Divider />
              <CardContent sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                {alerts.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <InfoOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No alerts to display
                    </Typography>
                  </Box>
                ) : (
                  <List dense>
                    {alerts.map((alert) => (
                      <ListItem key={alert.id} divider>
                        <ListItemIcon>
                          {alert.type === 'warning' ? (
                            <WarningIcon color="warning" />
                          ) : (
                            <InfoOutlinedIcon color="info" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={alert.message} 
                          secondary={alert.timestamp}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
              <Divider />
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  size="small" 
                  onClick={clearAlerts}
                  disabled={alerts.length === 0}
                >
                  Clear Alerts
                </Button>
              </Box>
            </Card>
          </Grid>
          
          {/* Tabs for different metrics */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  variant="fullWidth"
                >
                  <Tab label="Signal Strength" icon={<WifiIcon />} iconPosition="start" />
                  <Tab label="Temperature" icon={<ThermostatIcon />} iconPosition="start" />
                  <Tab label="Error Events" icon={<WarningIcon />} iconPosition="start" />
                </Tabs>
              </Box>
              
              <CardContent>
                <Box sx={{ height: 300 }}>
                  {tabValue === 0 && (
                    <Line data={signalChartData} options={chartOptions} />
                  )}
                  {tabValue === 1 && (
                    <Line data={temperatureChartData} options={temperatureChartOptions} />
                  )}
                  {tabValue === 2 && (
                    <Line data={errorChartData} options={errorChartOptions} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Device Info Panel */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardHeader 
                title="Device Information" 
                action={
                  <Chip 
                    icon={<MemoryIcon />}
                    label="RF-5000 Series"
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" gutterBottom>Device ID</Typography>
                    <Typography variant="body2">RF5-A2C45D9E</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" gutterBottom>Firmware Version</Typography>
                    <Typography variant="body2">v2.3.5 (Build 1045)</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" gutterBottom>Uptime</Typography>
                    <Typography variant="body2">14d 7h 32m</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" gutterBottom>Last Maintenance</Typography>
                    <Typography variant="body2">2023-04-15</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default LiveDataMonitor;
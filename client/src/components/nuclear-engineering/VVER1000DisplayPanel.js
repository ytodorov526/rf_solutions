// VVER1000DisplayPanel.js - Display and monitoring panel for the VVER-1000 simulator
import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  Badge,
  FormControl,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { formatTime } from './VVER1000Utils';
import { Line } from 'react-chartjs-2';

/**
 * Display Panel component for the VVER-1000 simulator
 * Shows reactor parameters, charts, alarms, and notifications
 */
function VVER1000DisplayPanel({
  state,
  isRunning,
  onToggleSimulation,
  onReset,
  onSpeedChange,
  powerChartData,
  temperatureChartData,
  pressureChartData,
  chartOptions
}) {
  // Chart references
  const powerChartRef = useRef(null);
  const temperatureChartRef = useRef(null);
  const pressureChartRef = useRef(null);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Reactor Parameters</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              {formatTime(state.time)}
            </Typography>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 100, mr: 1 }}>
            <Select
              value={state.timeMultiplier}
              onChange={onSpeedChange}
              displayEmpty
              disabled={isRunning}
            >
              <MenuItem value={0.5}>0.5x</MenuItem>
              <MenuItem value={1}>1.0x</MenuItem>
              <MenuItem value={2}>2.0x</MenuItem>
              <MenuItem value={5}>5.0x</MenuItem>
              <MenuItem value={10}>10.0x</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            color={isRunning ? "warning" : "success"}
            onClick={onToggleSimulation}
            disabled={!state.activeScenario || state.scenarioComplete || state.scenarioFailed}
            size="small"
            startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            sx={{ mr: 1 }}
          >
            {isRunning ? "Pause" : "Run"}
          </Button>
          
          <Button
            variant="outlined"
            onClick={onReset}
            size="small"
            startIcon={<RestartAltIcon />}
          >
            Reset
          </Button>
        </Box>
      </Box>
      
      {/* Parameter Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 200, mb: 2 }}>
            {state.powerHistory.length > 0 ? (
              <Line
                ref={powerChartRef}
                data={powerChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Power (%)'
                      },
                      min: 0,
                      max: 105
                    }
                  }
                }}
              />
            ) : (
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Run the simulation to see reactor power data
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 200, mb: 2 }}>
            {state.tempHistory.length > 0 ? (
              <Line
                ref={temperatureChartRef}
                data={temperatureChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Temperature (°C)'
                      },
                      min: 260,
                      max: 340
                    }
                  }
                }}
              />
            ) : (
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Run the simulation to see temperature data
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ height: 200 }}>
            {state.pressureHistory.length > 0 ? (
              <Line
                ref={pressureChartRef}
                data={pressureChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Pressure (MPa)'
                      },
                      min: 13,
                      max: 17
                    }
                  }
                }}
              />
            ) : (
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Run the simulation to see pressure data
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Alarms and Notifications */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          <Badge badgeContent={state.alarms.length} color="error" sx={{ mr: 1 }}>
            <NotificationsIcon color={state.alarms.length > 0 ? "error" : "action"} />
          </Badge>
          Alarms and Notifications
        </Typography>
        
        <Box sx={{ maxHeight: 150, overflowY: 'auto', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
          {state.alarms.length > 0 ? (
            state.alarms.map((alarm, index) => (
              <Alert 
                key={`alarm-${index}`}
                severity="error" 
                sx={{ mb: 1 }}
              >
                {alarm}
              </Alert>
            ))
          ) : (
            <Alert severity="success" sx={{ mb: 1 }}>No active alarms</Alert>
          )}
          
          {state.notifications.slice(-3).reverse().map((notification, index) => (
            <Alert 
              key={`notification-${index}`}
              severity={notification.type} 
              sx={{ mb: 1 }}
            >
              {notification.message} ({formatTime(notification.time)})
            </Alert>
          ))}
        </Box>
      </Box>
      
      {/* Scenario Status */}
      {state.activeScenario && (state.scenarioComplete || state.scenarioFailed) && (
        <Box sx={{ mt: 3 }}>
          <Alert
            severity={state.scenarioComplete ? "success" : "error"}
            variant="filled"
          >
            {state.scenarioComplete 
              ? `Scenario completed successfully!` 
              : `Scenario failed: ${state.failureReason}`}
          </Alert>
        </Box>
      )}
    </Paper>
  );
}

export default VVER1000DisplayPanel;
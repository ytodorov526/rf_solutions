// VVER1000ControlPanel.js - Control Panel interface for the VVER-1000 simulator
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Slider,
  Tooltip,
  IconButton,
  LinearProgress,
  Chip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { VVER1000 } from './VVER1000Constants';

/**
 * Control Panel component for the VVER-1000 simulator
 * Provides controls for adjusting reactor parameters
 */
function VVER1000ControlPanel({ 
  state, 
  onControlRodChange, 
  onGridToggle, 
  onAutoControlToggle,
  disabled
}) {
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Reactor Controls
        {disabled && <Chip label="Locked" color="error" size="small" sx={{ ml: 1 }} />}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Control Rod Position: {state.controlRodPosition}% inserted</Typography>
          <Tooltip title="Controls reactor power. Fully inserted (100%) = shutdown. Fully withdrawn (0%) = maximum reactivity.">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Slider
          value={state.controlRodPosition}
          onChange={onControlRodChange}
          min={0}
          max={100}
          step={1}
          marks={[
            { value: 0, label: '0%' },
            { value: 50, label: '50%' },
            { value: 100, label: '100%' }
          ]}
          disabled={disabled}
          sx={{
            '& .MuiSlider-track': {
              background: 'linear-gradient(to right, #ff5722, #1976d2)'
            }
          }}
        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Reactor Power: {state.reactorPower.toFixed(1)}%</Typography>
          <Tooltip title="Current reactor power as percentage of rated thermal power.">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={state.reactorPower} 
            sx={{ 
              flexGrow: 1, 
              height: 10, 
              borderRadius: 1,
              backgroundColor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                backgroundColor: state.reactorPower > 90 ? 'success.main' : 
                                state.reactorPower > 50 ? 'warning.main' : 
                                'primary.main'
              }
            }} 
          />
          <Typography variant="body2" sx={{ ml: 1, minWidth: 50 }}>
            {state.reactorPower.toFixed(1)}%
          </Typography>
        </Box>
        
        {/* Power rate of change indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Typography variant="caption" color={
            Math.abs(state.powerRateOfChange) > 4 ? "error" :
            Math.abs(state.powerRateOfChange) > 2 ? "warning.main" : 
            "text.secondary"
          }>
            Rate: {state.powerRateOfChange?.toFixed(1) || 0}%/min
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Primary Coolant Parameters</Typography>
          <Tooltip title="Temperature and pressure in the primary coolant circuit.">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Temperature:</Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'medium',
                color: state.primaryTemp > 320 ? 'error.main' : 
                        state.primaryTemp > 310 ? 'warning.main' : 
                        'text.primary'
              }}
            >
              {state.primaryTemp.toFixed(1)} °C
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Pressure:</Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'medium',
                color: state.primaryPressure > 16.5 ? 'error.main' : 
                        state.primaryPressure < 14.5 ? 'warning.main' : 
                        'text.primary'
              }}
            >
              {state.primaryPressure.toFixed(2)} MPa
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Secondary Circuit Parameters</Typography>
          <Tooltip title="Steam parameters in the secondary circuit.">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Steam Pressure:</Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'medium',
                color: state.secondaryPressure > 6.8 ? 'error.main' : 
                        state.secondaryPressure < 5.5 ? 'warning.main' : 
                        'text.primary'
              }}
            >
              {state.secondaryPressure.toFixed(2)} MPa
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Turbine Speed:</Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'medium',
                color: state.turbineRpm > 3200 ? 'error.main' : 
                        Math.abs(state.turbineRpm - VVER1000.turbineRpm) > 100 ? 'warning.main' : 
                        'text.primary'
              }}
            >
              {state.turbineRpm.toFixed(0)} RPM
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Grid Connection</Typography>
          <Tooltip title="Connect or disconnect generator from the power grid.">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Button
          variant={state.gridConnected ? "contained" : "outlined"}
          color={state.gridConnected ? "success" : "primary"}
          fullWidth
          onClick={onGridToggle}
          disabled={disabled}
          startIcon={<PowerSettingsNewIcon />}
          sx={{ mt: 1 }}
        >
          {state.gridConnected ? "Connected to Grid" : "Connect to Grid"}
        </Button>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Automatic Control Systems</Typography>
          <Tooltip title="Toggle between automatic and manual control for various plant systems.">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Grid container spacing={1} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <Button
              variant={state.autoControlSystems.pressurizer ? "contained" : "outlined"}
              color={state.autoControlSystems.pressurizer ? "success" : "info"}
              size="small"
              fullWidth
              onClick={() => onAutoControlToggle('pressurizer')}
              disabled={disabled}
            >
              Pressurizer: {state.autoControlSystems.pressurizer ? "AUTO" : "MANUAL"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant={state.autoControlSystems.feedwater ? "contained" : "outlined"}
              color={state.autoControlSystems.feedwater ? "success" : "info"}
              size="small"
              fullWidth
              onClick={() => onAutoControlToggle('feedwater')}
              disabled={disabled}
            >
              Feedwater: {state.autoControlSystems.feedwater ? "AUTO" : "MANUAL"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant={state.autoControlSystems.turbineGovernor ? "contained" : "outlined"}
              color={state.autoControlSystems.turbineGovernor ? "success" : "info"}
              size="small"
              fullWidth
              onClick={() => onAutoControlToggle('turbineGovernor')}
              disabled={disabled}
            >
              Turbine Governor: {state.autoControlSystems.turbineGovernor ? "AUTO" : "MANUAL"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Xenon level indicator (only shown when relevant) */}
      {state.xenonLevel > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Xenon Poisoning: {state.xenonLevel.toFixed(1)}%
            <Tooltip title="Xenon-135 is a neutron absorber produced during operation that reduces reactivity. High levels make power increases difficult.">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={state.xenonLevel} 
            color="warning"
            sx={{ height: 6, borderRadius: 1, mt: 0.5 }} 
          />
        </Box>
      )}
    </Paper>
  );
}

export default VVER1000ControlPanel;
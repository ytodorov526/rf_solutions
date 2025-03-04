import React, { useState } from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Drawer,
  Typography,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  Grid,
  Tooltip,
  RadioGroup,
  Radio,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BrushIcon from '@mui/icons-material/Brush';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useThemeContext, PRIMARY_COLORS } from '../theme/ThemeContext';

function ThemeSettings() {
  const [open, setOpen] = useState(false);
  const { mode, primaryColor, toggleMode, setPrimaryColor } = useThemeContext();
  const theme = useTheme();
  
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  const handleColorChange = (color) => {
    setPrimaryColor(color);
  };
  
  return (
    <>
      <SpeedDial
        ariaLabel="Theme Settings"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<BrushIcon />} />}
        onClick={toggleDrawer}
      />
      
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 280, px: 2, py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Theme Settings</Typography>
            <IconButton onClick={toggleDrawer} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Color Mode
          </Typography>
          
          <FormControlLabel
            control={
              <Switch 
                checked={mode === 'dark'} 
                onChange={toggleMode}
                icon={<LightModeIcon />}
                checkedIcon={<DarkModeIcon />}
              />
            }
            label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Primary Color
          </Typography>
          
          <RadioGroup 
            value={primaryColor}
            onChange={(e) => handleColorChange(e.target.value)}
            sx={{ display: 'flex' }}
          >
            <Grid container spacing={1}>
              {PRIMARY_COLORS.map((color) => (
                <Grid item key={color.name}>
                  <Tooltip title={color.name} placement="top">
                    <Box sx={{ position: 'relative' }}>
                      <Radio
                        value={color.name}
                        sx={{
                          opacity: 0,
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          zIndex: 1
                        }}
                      />
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: color.main,
                          cursor: 'pointer',
                          border: primaryColor === color.name ? '2px solid' : '2px solid transparent',
                          borderColor: mode === 'dark' ? 'white' : 'black',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
              Your theme preferences are saved automatically.
            </Typography>
            <Typography variant="body2">
              Current Theme: {mode === 'dark' ? 'Dark' : 'Light'} - {primaryColor}
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default ThemeSettings;
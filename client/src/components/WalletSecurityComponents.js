import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Chip,
  LinearProgress,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Security,
  Lock,
  LockOpen,
  Fingerprint,
  Notifications,
  Shield,
  Warning,
  CheckCircle,
  Error,
  Info,
  Visibility,
  VisibilityOff,
  Phone,
  Email,
  Sms,
  VpnKey,
  AccountBalance,
  CreditCard,
  MonetizationOn,
  Schedule,
  History,
  Settings,
  NotificationsActive,
  NotificationsOff,
  Payment
} from '@mui/icons-material';

// Mock security data
const mockSecurityData = {
  pin: {
    isSet: true,
    lastChanged: "2024-01-01"
  },
  biometric: {
    enabled: true,
    type: "fingerprint",
    lastUsed: "2024-01-15"
  },
  twoFactor: {
    enabled: true,
    method: "sms",
    phone: "+1 (555) 123-4567"
  },
  notifications: {
    transactionAlerts: true,
    securityAlerts: true,
    dailyLimits: true,
    monthlyLimits: false,
    loginAlerts: true
  },
  limits: {
    daily: 2000,
    monthly: 10000,
    perTransaction: 500,
    p2pDaily: 1000,
    merchantDaily: 1500
  },
  securityScore: 92,
  recentActivity: [
    {
      id: 1,
      type: "login",
      description: "Wallet accessed via mobile app",
      timestamp: "2024-01-15 08:30 AM",
      location: "New York, NY",
      device: "iPhone 14",
      status: "success"
    },
    {
      id: 2,
      type: "transaction",
      description: "Payment to Starbucks Coffee",
      timestamp: "2024-01-15 08:32 AM",
      amount: 5.50,
      status: "success"
    },
    {
      id: 3,
      type: "limit_change",
      description: "Daily limit increased to $2000",
      timestamp: "2024-01-14 02:15 PM",
      status: "success"
    },
    {
      id: 4,
      type: "security",
      description: "PIN verification successful",
      timestamp: "2024-01-14 09:45 AM",
      status: "success"
    }
  ]
};

// PIN Management Component
export const PINManagementComponent = ({ open, onClose }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleUpdatePin = () => {
    if (!currentPin || !newPin || !confirmPin) {
      setSnackbarMessage('Please fill in all PIN fields');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (newPin !== confirmPin) {
      setSnackbarMessage('New PIN and confirmation do not match');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (newPin.length !== 4) {
      setSnackbarMessage('PIN must be exactly 4 digits');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setSnackbarMessage('PIN updated successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    
    // Reset form
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VpnKey sx={{ mr: 1 }} />
            Manage Wallet PIN
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Your PIN is used to authorize wallet transactions and access sensitive features.
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current PIN"
                type={showPins ? "text" : "password"}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                inputProps={{ maxLength: 4, pattern: "[0-9]*" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPins(!showPins)}>
                        {showPins ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New PIN"
                type={showPins ? "text" : "password"}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                inputProps={{ maxLength: 4, pattern: "[0-9]*" }}
                helperText="Enter a 4-digit PIN"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New PIN"
                type={showPins ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                inputProps={{ maxLength: 4, pattern: "[0-9]*" }}
                helperText="Re-enter your new PIN"
              />
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    PIN Security Tips
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Use a unique 4-digit combination" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Avoid sequential numbers (1234, 4321)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Don't use obvious dates (birth year, etc.)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Change your PIN regularly" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleUpdatePin} 
            variant="contained"
            disabled={!currentPin || !newPin || !confirmPin}
          >
            Update PIN
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// Spending Limits Component
export const SpendingLimitsComponent = ({ open, onClose }) => {
  const [limits, setLimits] = useState(mockSecurityData.limits);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleLimitChange = (type, value) => {
    setLimits(prev => ({
      ...prev,
      [type]: parseFloat(value) || 0
    }));
  };

  const handleSaveLimits = () => {
    setSnackbarOpen(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MonetizationOn sx={{ mr: 1 }} />
            Spending Limits
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Set spending limits to control your wallet usage and enhance security.
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Transaction Limits
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Daily Limit"
                        type="number"
                        value={limits.daily}
                        onChange={(e) => handleLimitChange('daily', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Maximum daily spending"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Monthly Limit"
                        type="number"
                        value={limits.monthly}
                        onChange={(e) => handleLimitChange('monthly', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Maximum monthly spending"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Per Transaction Limit"
                        type="number"
                        value={limits.perTransaction}
                        onChange={(e) => handleLimitChange('perTransaction', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Maximum per single transaction"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Category Limits
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="P2P Daily Limit"
                        type="number"
                        value={limits.p2pDaily}
                        onChange={(e) => handleLimitChange('p2pDaily', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Daily limit for peer-to-peer transfers"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Merchant Daily Limit"
                        type="number"
                        value={limits.merchantDaily}
                        onChange={(e) => handleLimitChange('merchantDaily', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Daily limit for merchant payments"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Current Usage
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Daily Usage</Typography>
                          <Typography variant="body2">$156.75 / ${limits.daily}</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(156.75 / limits.daily) * 100} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Monthly Usage</Typography>
                          <Typography variant="body2">$2,340.50 / ${limits.monthly}</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(2340.50 / limits.monthly) * 100} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveLimits} variant="contained">
            Save Limits
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Spending limits updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

// Notification Settings Component
export const NotificationSettingsComponent = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState(mockSecurityData.notifications);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleNotificationChange = (type, value) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSaveSettings = () => {
    setSnackbarOpen(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Notifications sx={{ mr: 1 }} />
            Notification Settings
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Transaction Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Payment />
                  </ListItemIcon>
                  <ListItemText
                    primary="Transaction Alerts"
                    secondary="Get notified for all wallet transactions"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.transactionAlerts}
                      onChange={(e) => handleNotificationChange('transactionAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning />
                  </ListItemIcon>
                  <ListItemText
                    primary="Daily Limit Alerts"
                    secondary="Notify when approaching daily spending limit"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.dailyLimits}
                      onChange={(e) => handleNotificationChange('dailyLimits', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText
                    primary="Monthly Limit Alerts"
                    secondary="Notify when approaching monthly spending limit"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.monthlyLimits}
                      onChange={(e) => handleNotificationChange('monthlyLimits', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Security Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security Alerts"
                    secondary="Important security events and suspicious activity"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.securityAlerts}
                      onChange={(e) => handleNotificationChange('securityAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Lock />
                  </ListItemIcon>
                  <ListItemText
                    primary="Login Alerts"
                    secondary="Notify when wallet is accessed from new device"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.loginAlerts}
                      onChange={(e) => handleNotificationChange('loginAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                You can change these settings anytime. Critical security alerts cannot be disabled.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveSettings} variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Notification settings updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

// Security Activity Component
export const SecurityActivityComponent = ({ open, onClose }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return <Lock />;
      case 'transaction': return <Payment />;
      case 'limit_change': return <Settings />;
      case 'security': return <Security />;
      default: return <Info />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <History sx={{ mr: 1 }} />
          Security Activity
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Recent security-related activities on your wallet
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <List>
              {mockSecurityData.recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Chip
                        icon={getActivityIcon(activity.type)}
                        label=""
                        color={getActivityColor(activity.status)}
                        size="small"
                        sx={{ width: 40, height: 40, '& .MuiChip-label': { display: 'none' } }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {activity.timestamp}
                          </Typography>
                          {activity.location && (
                            <Typography variant="caption" display="block">
                              {activity.location} • {activity.device}
                            </Typography>
                          )}
                          {activity.amount && (
                            <Typography variant="caption" display="block">
                              Amount: ${activity.amount}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={activity.status}
                        color={getActivityColor(activity.status)}
                        size="small"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < mockSecurityData.recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Button variant="outlined">
                View Full Activity Log
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Wallet Security Dashboard
export const WalletSecurityDashboard = ({
  onManagePin,
  onSpendingLimits,
  onNotificationSettings,
  onViewActivity
}) => {
  const securityScore = mockSecurityData.securityScore;
  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Security Score */}
        <Grid item xs={12}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {securityScore}/100
                  </Typography>
                  <Typography variant="h6">
                    Security Score
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {securityScore >= 90 ? 'Excellent' : securityScore >= 70 ? 'Good' : 'Needs Improvement'}
                  </Typography>
                </Box>
                <Shield sx={{ fontSize: 60, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={securityScore} 
                sx={{ 
                  mt: 2, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Security Features */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Authentication
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <VpnKey color={mockSecurityData.pin.isSet ? 'success' : 'error'} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Wallet PIN"
                    secondary={mockSecurityData.pin.isSet ? 
                      `Last changed: ${mockSecurityData.pin.lastChanged}` : 
                      'Not set'
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button size="small" onClick={onManagePin}>
                      {mockSecurityData.pin.isSet ? 'Change' : 'Set'}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Fingerprint color={mockSecurityData.biometric.enabled ? 'success' : 'disabled'} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Biometric Login"
                    secondary={mockSecurityData.biometric.enabled ? 
                      `${mockSecurityData.biometric.type} enabled` : 
                      'Disabled'
                    }
                  />
                  <ListItemSecondaryAction>
                    <Switch checked={mockSecurityData.biometric.enabled} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Sms color={mockSecurityData.twoFactor.enabled ? 'success' : 'disabled'} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary={mockSecurityData.twoFactor.enabled ? 
                      `SMS to ${mockSecurityData.twoFactor.phone}` : 
                      'Disabled'
                    }
                  />
                  <ListItemSecondaryAction>
                    <Switch checked={mockSecurityData.twoFactor.enabled} />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <List>
                <ListItem button onClick={onSpendingLimits}>
                  <ListItemIcon>
                    <MonetizationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Spending Limits"
                    secondary="Manage daily and monthly limits"
                  />
                </ListItem>
                <ListItem button onClick={onNotificationSettings}>
                  <ListItemIcon>
                    <NotificationsActive />
                  </ListItemIcon>
                  <ListItemText
                    primary="Notifications"
                    secondary="Configure security alerts"
                  />
                </ListItem>
                <ListItem button onClick={onViewActivity}>
                  <ListItemIcon>
                    <History />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security Activity"
                    secondary="View recent security events"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Security Status */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">PIN Protected</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">Biometric Enabled</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">2FA Active</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">Alerts On</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Export mock security data
export { mockSecurityData };
import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import {
  AccountBalanceWallet,
  QrCode,
  QrCodeScanner,
  PersonAdd,
  Send,
  RequestPage,
  Store,
  Receipt,
  History,
  Security,
  Add,
  Remove,
  Search,
  FilterList,
  Download,
  Share,
  Star,
  StarBorder,
  Phone,
  Email,
  LocationOn,
  Category,
  Payment,
  MonetizationOn,
  Notifications,
  CheckCircle,
  Error,
  Warning,
  Info
} from '@mui/icons-material';

// Mock data for Digital Wallet
const mockWalletData = {
  balance: 1234.56,
  linkedAccount: "****1234",
  dailyLimit: 2000,
  monthlyLimit: 10000,
  dailySpent: 156.75,
  monthlySpent: 2340.50,
  contacts: [
    { 
      id: 1, 
      name: "John Smith", 
      phone: "+1 (555) 123-4567", 
      email: "john.smith@email.com",
      avatar: "JS",
      favorite: true,
      lastTransaction: "2024-01-14"
    },
    { 
      id: 2, 
      name: "Sarah Johnson", 
      phone: "+1 (555) 987-6543",
      email: "sarah.johnson@email.com", 
      avatar: "SJ",
      favorite: false,
      lastTransaction: "2024-01-10"
    },
    { 
      id: 3, 
      name: "Mike Davis", 
      phone: "+1 (555) 456-7890",
      email: "mike.davis@email.com", 
      avatar: "MD",
      favorite: true,
      lastTransaction: "2024-01-08"
    },
    { 
      id: 4, 
      name: "Emily Wilson", 
      phone: "+1 (555) 321-0987",
      email: "emily.wilson@email.com", 
      avatar: "EW",
      favorite: false,
      lastTransaction: "2024-01-05"
    }
  ],
  merchants: [
    { 
      id: 1, 
      name: "Starbucks Coffee", 
      category: "Food & Dining", 
      logo: "☕", 
      rating: 4.5,
      address: "123 Main St, New York, NY",
      distance: "0.2 miles",
      acceptsWallet: true,
      loyaltyProgram: true
    },
    { 
      id: 2, 
      name: "Target", 
      category: "Retail", 
      logo: "🎯", 
      rating: 4.2,
      address: "456 Broadway, New York, NY",
      distance: "0.5 miles",
      acceptsWallet: true,
      loyaltyProgram: false
    },
    { 
      id: 3, 
      name: "Shell Gas Station", 
      category: "Gas & Automotive", 
      logo: "⛽", 
      rating: 4.0,
      address: "789 5th Ave, New York, NY",
      distance: "0.8 miles",
      acceptsWallet: true,
      loyaltyProgram: true
    },
    { 
      id: 4, 
      name: "McDonald's", 
      category: "Fast Food", 
      logo: "🍟", 
      rating: 3.8,
      address: "321 Park Ave, New York, NY",
      distance: "1.2 miles",
      acceptsWallet: true,
      loyaltyProgram: true
    },
    { 
      id: 5, 
      name: "CVS Pharmacy", 
      category: "Health & Pharmacy", 
      logo: "💊", 
      rating: 4.1,
      address: "654 Lexington Ave, New York, NY",
      distance: "0.7 miles",
      acceptsWallet: true,
      loyaltyProgram: false
    }
  ],
  transactions: [
    { 
      id: 1, 
      type: "merchant", 
      amount: -5.50, 
      merchant: "Starbucks Coffee", 
      description: "Grande Latte",
      date: "2024-01-15", 
      time: "08:30 AM",
      status: "completed",
      category: "Food & Dining",
      paymentMethod: "QR Code"
    },
    { 
      id: 2, 
      type: "p2p_sent", 
      amount: -25.00, 
      contact: "John Smith", 
      description: "Lunch split",
      date: "2024-01-14", 
      time: "12:45 PM",
      status: "completed",
      category: "P2P Transfer",
      paymentMethod: "Quick Send"
    },
    { 
      id: 3, 
      type: "qr_payment", 
      amount: -12.75, 
      merchant: "Local Deli",
      description: "Sandwich & Drink",
      date: "2024-01-13", 
      time: "01:15 PM",
      status: "completed",
      category: "Food & Dining",
      paymentMethod: "QR Code"
    },
    { 
      id: 4, 
      type: "p2p_received", 
      amount: 50.00, 
      contact: "Sarah Johnson", 
      description: "Birthday gift",
      date: "2024-01-12", 
      time: "06:20 PM",
      status: "completed",
      category: "P2P Transfer",
      paymentMethod: "Request Money"
    },
    { 
      id: 5, 
      type: "merchant", 
      amount: -89.99, 
      merchant: "Target", 
      description: "Household items",
      date: "2024-01-11", 
      time: "03:30 PM",
      status: "completed",
      category: "Retail",
      paymentMethod: "Wallet Pay"
    },
    { 
      id: 6, 
      type: "wallet_topup", 
      amount: 200.00, 
      description: "Added from Checking Account",
      date: "2024-01-10", 
      time: "09:00 AM",
      status: "completed",
      category: "Account Transfer",
      paymentMethod: "Bank Transfer"
    }
  ]
};

// QR Code Generator Component
export const QRCodeGeneratorComponent = ({ open, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleGenerateQR = () => {
    if (amount) {
      setQrGenerated(true);
      setSnackbarOpen(true);
    }
  };

  const handleReset = () => {
    setAmount('');
    setDescription('');
    setQrGenerated(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QrCode sx={{ mr: 1 }} />
            Generate Payment QR Code
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {!qrGenerated ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this payment for?"
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 200, 
                    height: 200, 
                    border: '2px solid #ccc', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: '#f5f5f5'
                  }}>
                    <QrCode sx={{ fontSize: 120, color: '#666' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    Payment QR Code Generated
                  </Typography>
                  <Typography variant="body1" color="primary" gutterBottom>
                    Amount: ${amount}
                  </Typography>
                  {description && (
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" startIcon={<Share />} sx={{ mr: 1 }}>
                      Share
                    </Button>
                    <Button variant="outlined" startIcon={<Download />}>
                      Save
                    </Button>
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          {!qrGenerated ? (
            <Button 
              onClick={handleGenerateQR} 
              variant="contained"
              disabled={!amount}
            >
              Generate QR Code
            </Button>
          ) : (
            <Button onClick={handleReset} variant="contained">
              Create New QR
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          QR Code generated successfully! Share it to receive payment.
        </Alert>
      </Snackbar>
    </>
  );
};

// QR Code Scanner Component
export const QRCodeScannerComponent = ({ open, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const mockQRData = {
    merchant: "Starbucks Coffee",
    amount: 5.50,
    description: "Grande Latte",
    merchantId: "STBX_001"
  };

  const handleStartScan = () => {
    setScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      setScannedData(mockQRData);
    }, 3000);
  };

  const handlePayment = () => {
    setSnackbarMessage(`Payment of $${scannedData.amount} to ${scannedData.merchant} completed successfully!`);
    setSnackbarOpen(true);
    setScannedData(null);
    onClose();
  };

  const handleReset = () => {
    setScannedData(null);
    setScanning(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QrCodeScanner sx={{ mr: 1 }} />
            Scan QR Code to Pay
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {!scanning && !scannedData && (
              <Grid item xs={12}>
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <QrCodeScanner sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Ready to Scan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Position the QR code within the camera frame to make a payment
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleStartScan}
                    startIcon={<QrCodeScanner />}
                  >
                    Start Scanning
                  </Button>
                </Card>
              </Grid>
            )}

            {scanning && (
              <Grid item xs={12}>
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ 
                    width: 200, 
                    height: 200, 
                    border: '3px solid #1976d2', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <QrCodeScanner sx={{ fontSize: 60, color: 'primary.main' }} />
                    <LinearProgress 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0,
                        height: 4
                      }} 
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    Scanning...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hold steady while we read the QR code
                  </Typography>
                </Card>
              </Grid>
            )}

            {scannedData && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        <strong>Merchant:</strong> {scannedData.merchant}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Amount:</strong> ${scannedData.amount}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Description:</strong> {scannedData.description}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Payment from Wallet Balance
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${scannedData.amount}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {scannedData && (
            <>
              <Button onClick={handleReset}>Scan Again</Button>
              <Button onClick={handlePayment} variant="contained">
                Pay ${scannedData.amount}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// P2P Transfer Component
export const P2PTransferComponent = ({ open, onClose }) => {
  const [selectedContact, setSelectedContact] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [transferType, setTransferType] = useState('send');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleTransfer = () => {
    if (selectedContact && amount) {
      const contact = mockWalletData.contacts.find(c => c.id === selectedContact);
      const action = transferType === 'send' ? 'sent to' : 'requested from';
      setSnackbarMessage(`$${amount} ${action} ${contact.name} successfully!`);
      setSnackbarOpen(true);
      setSelectedContact('');
      setAmount('');
      setMessage('');
      onClose();
    }
  };

  const favoriteContacts = mockWalletData.contacts.filter(c => c.favorite);
  const allContacts = mockWalletData.contacts;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Send sx={{ mr: 1 }} />
            Peer-to-Peer Transfer
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Tabs 
                value={transferType} 
                onChange={(e, value) => setTransferType(value)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Send Money" value="send" />
                <Tab label="Request Money" value="request" />
              </Tabs>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {transferType === 'send' ? 'Send to Contact' : 'Request from Contact'}
              </Typography>
              
              {favoriteContacts.length > 0 && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Favorites
                  </Typography>
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    {favoriteContacts.map((contact) => (
                      <Grid item key={contact.id}>
                        <Card 
                          variant={selectedContact === contact.id ? "outlined" : "elevation"}
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedContact === contact.id ? '2px solid' : 'none',
                            borderColor: 'primary.main'
                          }}
                          onClick={() => setSelectedContact(contact.id)}
                        >
                          <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
                              {contact.avatar}
                            </Avatar>
                            <Typography variant="caption">
                              {contact.name.split(' ')[0]}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Contact</InputLabel>
                <Select
                  value={selectedContact}
                  label="Select Contact"
                  onChange={(e) => setSelectedContact(e.target.value)}
                >
                  {allContacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                          {contact.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{contact.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {contact.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Message (Optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's this for?"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Recent Contacts
              </Typography>
              <List>
                {allContacts.slice(0, 4).map((contact) => (
                  <ListItem 
                    key={contact.id}
                    button
                    onClick={() => setSelectedContact(contact.id)}
                    selected={selectedContact === contact.id}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {contact.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={contact.name}
                      secondary={`Last transaction: ${contact.lastTransaction}`}
                    />
                    {contact.favorite && (
                      <Star color="primary" fontSize="small" />
                    )}
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleTransfer} 
            variant="contained"
            disabled={!selectedContact || !amount}
          >
            {transferType === 'send' ? 'Send Money' : 'Request Money'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// Merchant Payment Component
export const MerchantPaymentComponent = ({ open, onClose }) => {
  const [selectedMerchant, setSelectedMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const categories = ['all', 'Food & Dining', 'Retail', 'Gas & Automotive', 'Fast Food', 'Health & Pharmacy'];
  
  const filteredMerchants = mockWalletData.merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || merchant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePayment = () => {
    if (selectedMerchant && amount) {
      const merchant = mockWalletData.merchants.find(m => m.id === selectedMerchant);
      setSnackbarMessage(`Payment of $${amount} to ${merchant.name} completed successfully!`);
      setSnackbarOpen(true);
      setSelectedMerchant('');
      setAmount('');
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Store sx={{ mr: 1 }} />
            Merchant Payments
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  placeholder="Search merchants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                  }}
                  sx={{ flex: 1 }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Available Merchants
              </Typography>
              <Grid container spacing={2}>
                {filteredMerchants.map((merchant) => (
                  <Grid item xs={12} sm={6} key={merchant.id}>
                    <Card 
                      variant={selectedMerchant === merchant.id ? "outlined" : "elevation"}
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedMerchant === merchant.id ? '2px solid' : 'none',
                        borderColor: 'primary.main'
                      }}
                      onClick={() => setSelectedMerchant(merchant.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h4" sx={{ mr: 2 }}>
                            {merchant.logo}
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6">{merchant.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {merchant.category}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Star sx={{ color: '#ffc107', fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2">{merchant.rating}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {merchant.address}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {merchant.distance}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {merchant.acceptsWallet && (
                              <Chip label="Wallet Pay" size="small" color="primary" />
                            )}
                            {merchant.loyaltyProgram && (
                              <Chip label="Rewards" size="small" color="secondary" />
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              {selectedMerchant ? (
                <Card variant="outlined">
                  <CardContent>
                    {(() => {
                      const merchant = mockWalletData.merchants.find(m => m.id === selectedMerchant);
                      return (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" sx={{ mr: 2 }}>
                              {merchant.logo}
                            </Typography>
                            <Box>
                              <Typography variant="h6">{merchant.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {merchant.category}
                              </Typography>
                            </Box>
                          </Box>
                          <TextField
                            fullWidth
                            label="Payment Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{ mb: 2 }}
                          />
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Payment Method:</Typography>
                            <Typography variant="body2">Digital Wallet</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Available Balance:</Typography>
                            <Typography variant="body2">${mockWalletData.balance}</Typography>
                          </Box>
                          {merchant.loyaltyProgram && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Rewards Points:</Typography>
                              <Typography variant="body2">+{Math.floor(parseFloat(amount || 0) * 2)} pts</Typography>
                            </Box>
                          )}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card variant="outlined" sx={{ textAlign: 'center', p: 3 }}>
                  <Store sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Select a merchant to make a payment
                  </Typography>
                </Card>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            disabled={!selectedMerchant || !amount}
          >
            Pay ${amount || '0.00'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// Wallet Transaction History Component
export const WalletTransactionHistoryComponent = ({ open, onClose }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const transactionTypes = ['all', 'merchant', 'p2p_sent', 'p2p_received', 'qr_payment', 'wallet_topup'];
  const dateRanges = ['all', 'today', 'week', 'month', 'year'];

  const filteredTransactions = mockWalletData.transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.merchant && transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.contact && transaction.contact.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'merchant': return <Store />;
      case 'p2p_sent': return <Send />;
      case 'p2p_received': return <Receipt />;
      case 'qr_payment': return <QrCode />;
      case 'wallet_topup': return <Add />;
      default: return <Payment />;
    }
  };

  const getTransactionColor = (amount) => {
    return amount > 0 ? 'success.main' : 'error.main';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <History sx={{ mr: 1 }} />
          Wallet Transaction History
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                }}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="merchant">Merchant</MenuItem>
                  <MenuItem value="p2p_sent">P2P Sent</MenuItem>
                  <MenuItem value="p2p_received">P2P Received</MenuItem>
                  <MenuItem value="qr_payment">QR Payment</MenuItem>
                  <MenuItem value="wallet_topup">Top Up</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={dateRange}
                  label="Period"
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                            {getTransactionIcon(transaction.type)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {transaction.merchant || transaction.contact || 'Wallet Transaction'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{transaction.date}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.time}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={transaction.paymentMethod} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color={getTransactionColor(transaction.amount)}
                          fontWeight="bold"
                        >
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color="success"
                          size="small"
                          icon={<CheckCircle />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredTransactions.length} of {mockWalletData.transactions.length} transactions
              </Typography>
              <Button variant="outlined" startIcon={<Download />}>
                Export Transactions
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

// Main Digital Wallet Dashboard Component
export const DigitalWalletDashboard = ({
  onQRGenerate,
  onQRScan,
  onP2PTransfer,
  onMerchantPay,
  onViewHistory,
  onAddMoney
}) => {
  const dailyLimitUsed = (mockWalletData.dailySpent / mockWalletData.dailyLimit) * 100;
  const monthlyLimitUsed = (mockWalletData.monthlySpent / mockWalletData.monthlyLimit) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Wallet Balance Card */}
        <Grid item xs={12}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    ${mockWalletData.balance.toFixed(2)}
                  </Typography>
                  <Typography variant="body1">
                    Digital Wallet Balance
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Linked to Account: {mockWalletData.linkedAccount}
                  </Typography>
                </Box>
                <AccountBalanceWallet sx={{ fontSize: 60, opacity: 0.8 }} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<Add />}
                  onClick={onAddMoney}
                  sx={{ mr: 1 }}
                >
                  Add Money
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<History />}
                  onClick={onViewHistory}
                >
                  View History
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ cursor: 'pointer' }} onClick={onQRScan}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <QrCodeScanner sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">Scan & Pay</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scan QR codes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ cursor: 'pointer' }} onClick={onQRGenerate}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <QrCode sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6">Generate QR</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ cursor: 'pointer' }} onClick={onP2PTransfer}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Send sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6">Send Money</Typography>
                  <Typography variant="body2" color="text.secondary">
                    P2P transfers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ cursor: 'pointer' }} onClick={onMerchantPay}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Store sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h6">Pay Merchants</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Store payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Spending Limits */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Spending Limit
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    ${mockWalletData.dailySpent} of ${mockWalletData.dailyLimit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dailyLimitUsed.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={dailyLimitUsed}
                  sx={{ height: 8, borderRadius: 4 }}
                  color={dailyLimitUsed > 80 ? 'warning' : 'primary'}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Remaining: ${(mockWalletData.dailyLimit - mockWalletData.dailySpent).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Spending Limit
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    ${mockWalletData.monthlySpent} of ${mockWalletData.monthlyLimit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {monthlyLimitUsed.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={monthlyLimitUsed}
                  sx={{ height: 8, borderRadius: 4 }}
                  color={monthlyLimitUsed > 80 ? 'warning' : 'primary'}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Remaining: ${(mockWalletData.monthlyLimit - mockWalletData.monthlySpent).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Transactions
                </Typography>
                <Button size="small" onClick={onViewHistory}>
                  View All
                </Button>
              </Box>
              <List>
                {mockWalletData.transactions.slice(0, 5).map((transaction) => (
                  <ListItem key={transaction.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getTransactionIcon(transaction.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={transaction.merchant || transaction.contact || 'Wallet Transaction'}
                      secondary={`${transaction.description} • ${transaction.date} ${transaction.time}`}
                    />
                    <Typography
                      variant="body1"
                      color={getTransactionColor(transaction.amount)}
                      fontWeight="bold"
                    >
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper function for transaction icons (used in dashboard)
const getTransactionIcon = (type) => {
  switch (type) {
    case 'merchant': return <Store />;
    case 'p2p_sent': return <Send />;
    case 'p2p_received': return <Receipt />;
    case 'qr_payment': return <QrCode />;
    case 'wallet_topup': return <Add />;
    default: return <Payment />;
  }
};

// Helper function for transaction colors (used in dashboard)
const getTransactionColor = (amount) => {
  return amount > 0 ? 'success.main' : 'error.main';
};

// Export mock data for use in other components
export { mockWalletData };
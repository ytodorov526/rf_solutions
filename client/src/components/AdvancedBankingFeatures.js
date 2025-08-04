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
  Slider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add,
  Chat,
  Phone,
  Email,
  LocationOn,
  Schedule,
  Psychology,
  CurrencyExchange,
  AccountBalanceWallet,
  Security,
  Notifications,
  SmartToy,
  Analytics,
  Savings,
  CreditCard,
  Payment,
  Receipt,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance,
  CurrencyBitcoin,
  Language,
  Flight,
  LocalShipping,
  ShoppingCart,
  Restaurant,
  Home,
  DirectionsCar,
  HealthAndSafety,
  School,
  SportsEsports,
  Movie,
  MusicNote,
  Pets,
  ChildCare,
  Elderly,
  Work,
  Business,
  Store,
  LocalGasStation,
  LocalHospital,
  LocalPharmacy,
  LocalGroceryStore,
  LocalBar,
  LocalCafe,
  LocalPizza,
  LocalTaxi,
  LocalHotel,
  LocalAirport,
  LocalAtm,
  LocalBank,
  LocalPostOffice,
  LocalLibrary,
  LocalParking,
  LocalPolice,
  LocalFireDepartment,
  LocalAmbulance,
  LocalConvenienceStore,
  MoreHoriz,
  LocalHardwareStore,
  LocalLaundryService,
  LocalCarWash
} from '@mui/icons-material';

// Mock data for advanced features
const mockCryptoData = [
  { symbol: 'BTC', name: 'Bitcoin', price: 43250.75, change: 2.34, balance: 0.0234, value: 1012.67 },
  { symbol: 'ETH', name: 'Ethereum', price: 2650.30, change: -1.25, balance: 1.567, value: 4153.02 },
  { symbol: 'ADA', name: 'Cardano', price: 0.485, change: 5.67, balance: 2500, value: 1212.50 },
  { symbol: 'SOL', name: 'Solana', price: 98.45, change: 8.92, balance: 12.5, value: 1230.63 }
];

const mockInternationalRates = [
  { currency: 'EUR', name: 'Euro', rate: 0.85, change: 0.02 },
  { currency: 'GBP', name: 'British Pound', rate: 0.73, change: -0.01 },
  { currency: 'JPY', name: 'Japanese Yen', rate: 110.25, change: 0.15 },
  { currency: 'CAD', name: 'Canadian Dollar', rate: 1.25, change: -0.03 },
  { currency: 'AUD', name: 'Australian Dollar', rate: 1.35, change: 0.05 }
];

const mockSpendingCategories = [
  { category: 'Food & Dining', amount: 456.78, percentage: 25, icon: Restaurant, color: '#FF6B6B' },
  { category: 'Transportation', amount: 234.56, percentage: 13, icon: DirectionsCar, color: '#4ECDC4' },
  { category: 'Shopping', amount: 345.67, percentage: 19, icon: ShoppingCart, color: '#45B7D1' },
  { category: 'Entertainment', amount: 123.45, percentage: 7, icon: SportsEsports, color: '#96CEB4' },
  { category: 'Utilities', amount: 234.56, percentage: 13, icon: Home, color: '#FFEAA7' },
  { category: 'Healthcare', amount: 156.78, percentage: 9, icon: HealthAndSafety, color: '#DDA0DD' },
  { category: 'Education', amount: 89.12, percentage: 5, icon: School, color: '#98D8C8' },
  { category: 'Other', amount: 123.45, percentage: 7, icon: MoreHoriz, color: '#F7DC6F' }
];

const mockAIInsights = [
  {
    type: 'spending',
    title: 'Unusual Spending Pattern Detected',
    description: 'Your restaurant spending is 45% higher than last month. Consider setting a budget.',
    severity: 'warning',
    action: 'Set Budget Alert'
  },
  {
    type: 'savings',
    title: 'Savings Opportunity Identified',
    description: 'You could save $150/month by reducing subscription services.',
    severity: 'info',
    action: 'Review Subscriptions'
  },
  {
    type: 'investment',
    title: 'Investment Recommendation',
    description: 'Based on your risk profile, consider increasing your retirement contributions.',
    severity: 'success',
    action: 'Adjust Portfolio'
  }
];

export const CryptoPortfolioComponent = ({ open, onClose }) => {
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleBuy = () => {
    if (selectedCrypto && buyAmount) {
      setSnackbarMessage(`Successfully purchased $${buyAmount} of ${selectedCrypto}`);
      setSnackbarOpen(true);
      setBuyAmount('');
      setSelectedCrypto('');
    }
  };

  const handleSell = () => {
    if (selectedCrypto && sellAmount) {
      setSnackbarMessage(`Successfully sold $${sellAmount} of ${selectedCrypto}`);
      setSnackbarOpen(true);
      setSellAmount('');
      setSelectedCrypto('');
    }
  };

  const totalPortfolioValue = mockCryptoData.reduce((sum, crypto) => sum + crypto.value, 0);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Crypto Portfolio</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CurrencyBitcoin sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">${totalPortfolioValue.toFixed(2)}</Typography>
                      <Typography variant="body2">Total Portfolio Value</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">
                    +$234.56 (+2.34%) this week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Your Holdings
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell>Balance</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>24h Change</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockCryptoData.map((crypto) => (
                      <TableRow key={crypto.symbol}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                              {crypto.symbol}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {crypto.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {crypto.symbol}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{crypto.balance}</TableCell>
                        <TableCell>${crypto.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${crypto.change > 0 ? '+' : ''}${crypto.change}%`}
                            color={crypto.change > 0 ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>${crypto.value.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Buy Crypto
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Crypto Asset</InputLabel>
                    <Select
                      value={selectedCrypto}
                      label="Crypto Asset"
                      onChange={(e) => setSelectedCrypto(e.target.value)}
                    >
                      {mockCryptoData.map((crypto) => (
                        <MenuItem key={crypto.symbol} value={crypto.symbol}>
                          {crypto.name} ({crypto.symbol})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Amount (USD)"
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleBuy}
                    disabled={!selectedCrypto || !buyAmount}
                  >
                    Buy Crypto
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Sell Crypto
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Crypto Asset</InputLabel>
                    <Select
                      value={selectedCrypto}
                      label="Crypto Asset"
                      onChange={(e) => setSelectedCrypto(e.target.value)}
                    >
                      {mockCryptoData.map((crypto) => (
                        <MenuItem key={crypto.symbol} value={crypto.symbol}>
                          {crypto.name} ({crypto.symbol})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Amount (USD)"
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={handleSell}
                    disabled={!selectedCrypto || !sellAmount}
                  >
                    Sell Crypto
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
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

export const InternationalTransferComponent = ({ open, onClose }) => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientBank, setRecipientBank] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [transferType, setTransferType] = useState('wire');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleTransfer = () => {
    if (amount && recipientName && recipientBank && recipientAccount) {
      setSnackbarOpen(true);
      onClose();
      setAmount('');
      setRecipientName('');
      setRecipientBank('');
      setRecipientAccount('');
    }
  };

  const getExchangeRate = () => {
    const rate = mockInternationalRates.find(r => r.currency === toCurrency);
    return rate ? rate.rate : 1;
  };

  const convertedAmount = amount ? (parseFloat(amount) * getExchangeRate()) : 0;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>International Transfer</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Exchange Rates
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Currency</TableCell>
                      <TableCell>Rate (USD)</TableCell>
                      <TableCell>24h Change</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockInternationalRates.map((rate) => (
                      <TableRow key={rate.currency}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Language sx={{ mr: 1 }} />
                            {rate.name} ({rate.currency})
                          </Box>
                        </TableCell>
                        <TableCell>{rate.rate}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${rate.change > 0 ? '+' : ''}${rate.change}%`}
                            color={rate.change > 0 ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Transfer Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>From Currency</InputLabel>
                    <Select
                      value={fromCurrency}
                      label="From Currency"
                      onChange={(e) => setFromCurrency(e.target.value)}
                    >
                      <MenuItem value="USD">USD - US Dollar</MenuItem>
                      <MenuItem value="EUR">EUR - Euro</MenuItem>
                      <MenuItem value="GBP">GBP - British Pound</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>To Currency</InputLabel>
                    <Select
                      value={toCurrency}
                      label="To Currency"
                      onChange={(e) => setToCurrency(e.target.value)}
                    >
                      {mockInternationalRates.map((rate) => (
                        <MenuItem key={rate.currency} value={rate.currency}>
                          {rate.currency} - {rate.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Transfer Type</InputLabel>
                    <Select
                      value={transferType}
                      label="Transfer Type"
                      onChange={(e) => setTransferType(e.target.value)}
                    >
                      <MenuItem value="wire">Wire Transfer</MenuItem>
                      <MenuItem value="swift">SWIFT Transfer</MenuItem>
                      <MenuItem value="sepa">SEPA Transfer (EU)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Recipient Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Recipient Name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={recipientBank}
                    onChange={(e) => setRecipientBank(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={recipientAccount}
                    onChange={(e) => setRecipientAccount(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            {amount && (
              <Grid item xs={12}>
                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Transfer Summary
                    </Typography>
                    <Typography variant="body1">
                      You will send: ${parseFloat(amount).toFixed(2)} {fromCurrency}
                    </Typography>
                    <Typography variant="body1">
                      Recipient will receive: {convertedAmount.toFixed(2)} {toCurrency}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Exchange Rate: 1 {fromCurrency} = {getExchangeRate()} {toCurrency}
                    </Typography>
                    <Typography variant="body2">
                      Transfer Fee: $25.00
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleTransfer} 
            variant="contained"
            disabled={!amount || !recipientName || !recipientBank || !recipientAccount}
          >
            Send Transfer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          International transfer initiated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export const AIInsightsComponent = ({ open, onClose }) => {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleAction = (insight) => {
    setSnackbarOpen(true);
    setSelectedInsight(insight);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToy sx={{ mr: 1 }} />
            AI Financial Insights
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Financial Health Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" sx={{ mr: 2 }}>85/100</Typography>
                    <Box>
                      <Typography variant="body1">Excellent</Typography>
                      <Typography variant="body2">Your finances are in great shape!</Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Smart Insights
              </Typography>
              <Grid container spacing={2}>
                {mockAIInsights.map((insight, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {insight.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {insight.description}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleAction(insight)}
                          >
                            {insight.action}
                          </Button>
                        </Box>
                        <Chip
                          label={insight.severity}
                          color={getSeverityColor(insight.severity)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Spending Analysis
              </Typography>
              <Grid container spacing={2}>
                {mockSpendingCategories.map((category, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: category.color, mr: 2 }}>
                            <category.icon />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6">{category.category}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${category.amount} ({category.percentage}%)
                            </Typography>
                          </Box>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={category.percentage} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {selectedInsight ? `${selectedInsight.action} completed!` : 'Action completed successfully!'}
        </Alert>
      </Snackbar>
    </>
  );
}; 
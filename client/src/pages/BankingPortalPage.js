import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Paper,
  Divider,
  Chip,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance,
  Savings,
  CreditCard,
  Payment,
  TransferWithinAStation,
  Receipt,
  TrendingUp,
  Security,
  Visibility,
  VisibilityOff,
  Add,
  Remove,
  ShowChart,
  Calculate,
  PieChart,
  Chat,
  Phone,
  Email,
  LocationOn,
  CurrencyBitcoin,
  Language,
  SmartToy
} from '@mui/icons-material';

// Import enhanced banking components
import { BillPaymentComponent, StatementComponent, SecuritySettingsComponent } from '../components/BankingComponents';
import {
  InvestmentPortfolioComponent,
  LoanCalculatorComponent,
  BudgetTrackerComponent,
  CustomerSupportComponent
} from '../components/EnhancedBankingFeatures';
import {
  CryptoPortfolioComponent,
  InternationalTransferComponent,
  AIInsightsComponent
} from '../components/AdvancedBankingFeatures';
import GoalTracking from '../components/GoalTracking';
import SavingsChallenges from '../components/SavingsChallenges';
import FinancialWellnessScore from '../components/FinancialWellnessScore';
import {
  QRCodeGeneratorComponent,
  QRCodeScannerComponent,
  P2PTransferComponent,
  MerchantPaymentComponent,
  WalletTransactionHistoryComponent,
  DigitalWalletDashboard,
  mockWalletData
} from '../components/DigitalWalletComponents';
import {
  PINManagementComponent,
  SpendingLimitsComponent,
  NotificationSettingsComponent,
  SecurityActivityComponent,
  WalletSecurityDashboard
} from '../components/WalletSecurityComponents';

// Mock data for the banking portal
const mockUserData = {
  name: "John Smith",
  accountNumber: "****1234",
  checkingBalance: 2547.89,
  savingsBalance: 12500.45,
  creditCardBalance: 1250.30,
  creditLimit: 10000,
  recentTransactions: [
    { id: 1, type: "debit", amount: 45.67, description: "Grocery Store", date: "2024-01-15", category: "Food" },
    { id: 2, type: "credit", amount: 2500.00, description: "Salary Deposit", date: "2024-01-14", category: "Income" },
    { id: 3, type: "debit", amount: 89.99, description: "Gas Station", date: "2024-01-13", category: "Transportation" },
    { id: 4, type: "debit", amount: 125.50, description: "Online Purchase", date: "2024-01-12", category: "Shopping" },
    { id: 5, type: "credit", amount: 150.00, description: "Refund", date: "2024-01-11", category: "Refund" }
  ]
};

function BankingPortalPage() {
  const [tabValue, setTabValue] = useState(12); // Set to 12 to show the Personal Finance tab by default
  const [showBalance, setShowBalance] = useState(true);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [billPaymentDialogOpen, setBillPaymentDialogOpen] = useState(false);
  const [statementDialogOpen, setStatementDialogOpen] = useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);
  const [loanCalculatorDialogOpen, setLoanCalculatorDialogOpen] = useState(false);
  const [budgetTrackerDialogOpen, setBudgetTrackerDialogOpen] = useState(false);
  const [customerSupportDialogOpen, setCustomerSupportDialogOpen] = useState(false);
  const [cryptoDialogOpen, setCryptoDialogOpen] = useState(false);
  const [internationalTransferDialogOpen, setInternationalTransferDialogOpen] = useState(false);
  const [aiInsightsDialogOpen, setAiInsightsDialogOpen] = useState(false);
  
  // Digital Wallet dialog states
  const [qrGeneratorDialogOpen, setQrGeneratorDialogOpen] = useState(false);
  const [qrScannerDialogOpen, setQrScannerDialogOpen] = useState(false);
  const [p2pTransferDialogOpen, setP2pTransferDialogOpen] = useState(false);
  const [merchantPaymentDialogOpen, setMerchantPaymentDialogOpen] = useState(false);
  const [walletHistoryDialogOpen, setWalletHistoryDialogOpen] = useState(false);
  const [addMoneyDialogOpen, setAddMoneyDialogOpen] = useState(false);
  
  // Wallet Security dialog states
  const [pinManagementDialogOpen, setPinManagementDialogOpen] = useState(false);
  const [spendingLimitsDialogOpen, setSpendingLimitsDialogOpen] = useState(false);
  const [notificationSettingsDialogOpen, setNotificationSettingsDialogOpen] = useState(false);
  const [securityActivityDialogOpen, setSecurityActivityDialogOpen] = useState(false);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentTo, setPaymentTo] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTransfer = () => {
    if (transferAmount && transferTo) {
      setSnackbarMessage(`Transfer of $${transferAmount} to ${transferTo} completed successfully!`);
      setSnackbarOpen(true);
      setTransferDialogOpen(false);
      setTransferAmount("");
      setTransferTo("");
    }
  };

  const handlePayment = () => {
    if (paymentAmount && paymentTo) {
      setSnackbarMessage(`Payment of $${paymentAmount} to ${paymentTo} completed successfully!`);
      setSnackbarOpen(true);
      setPaymentDialogOpen(false);
      setPaymentAmount("");
      setPaymentTo("");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to Your Banking Portal
              </Typography>
              <Typography variant="subtitle1">
                {mockUserData.name} • Account: {mockUserData.accountNumber}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={showBalance ? <VisibilityOff /> : <Visibility />}
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? "Hide" : "Show"} Balance
            </Button>
          </Box>
        </Paper>

        {/* Account Overview */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <AccountBalance />
                  </Avatar>
                  <Typography variant="h6">Checking Account</Typography>
                </Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {showBalance ? `$${mockUserData.checkingBalance.toFixed(2)}` : "****"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available Balance
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<TransferWithinAStation />} onClick={() => setTransferDialogOpen(true)}>
                  Transfer
                </Button>
                <Button size="small" startIcon={<Payment />} onClick={() => setPaymentDialogOpen(true)}>
                  Pay
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <Savings />
                  </Avatar>
                  <Typography variant="h6">Savings Account</Typography>
                </Box>
                <Typography variant="h4" color="success.main" gutterBottom>
                  {showBalance ? `$${mockUserData.savingsBalance.toFixed(2)}` : "****"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Balance
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<TrendingUp />} onClick={() => setStatementDialogOpen(true)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <CreditCard />
                  </Avatar>
                  <Typography variant="h6">Credit Card</Typography>
                </Box>
                <Typography variant="h4" color="warning.main" gutterBottom>
                  {showBalance ? `$${mockUserData.creditCardBalance.toFixed(2)}` : "****"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Balance
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Credit Limit: ${mockUserData.creditLimit.toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Payment />} onClick={() => setPaymentDialogOpen(true)}>
                  Make Payment
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs for different sections */}
        <Paper elevation={3}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }} variant="scrollable" scrollButtons="auto">
            <Tab label="Recent Transactions" />
            <Tab label="Quick Actions" />
            <Tab label="Digital Wallet" />
            <Tab label="Investments" />
            <Tab label="Loans & Credit" />
            <Tab label="Budget & Analytics" />
            <Tab label="Crypto & Digital Assets" />
            <Tab label="International Banking" />
            <Tab label="AI Insights" />
            <Tab label="Wallet Security" />
            <Tab label="Account Security" />
            <Tab label="Support" />
            <Tab label="Personal Finance" />
          </Tabs>
 
           {/* Recent Transactions Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <List>
                {mockUserData.recentTransactions.map((transaction) => (
                  <ListItem key={transaction.id} divider>
                    <ListItemIcon>
                      {transaction.type === 'credit' ? (
                        <Add color="success" />
                      ) : (
                        <Remove color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={transaction.description}
                      secondary={`${transaction.date} • ${transaction.category}`}
                    />
                    <Typography
                      variant="body1"
                      color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Quick Actions Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TransferWithinAStation sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6">Transfer Money</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Move money between accounts
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button fullWidth onClick={() => setTransferDialogOpen(true)}>
                        Transfer
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Payment sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h6">Pay Bills</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay bills and utilities
                      </Typography>
                    </CardContent>
                    <CardActions>
                                           <Button fullWidth onClick={() => setBillPaymentDialogOpen(true)}>
                       Pay Now
                     </Button>
                   </CardActions>
                 </Card>
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                 <Card>
                   <CardContent sx={{ textAlign: 'center' }}>
                     <Receipt sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                     <Typography variant="h6">Statements</Typography>
                     <Typography variant="body2" color="text.secondary">
                       View account statements
                     </Typography>
                   </CardContent>
                   <CardActions>
                     <Button fullWidth onClick={() => setStatementDialogOpen(true)}>
                       View
                     </Button>
                   </CardActions>
                 </Card>
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                 <Card>
                   <CardContent sx={{ textAlign: 'center' }}>
                     <Security sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                     <Typography variant="h6">Security</Typography>
                     <Typography variant="body2" color="text.secondary">
                       Manage account security
                     </Typography>
                   </CardContent>
                   <CardActions>
                     <Button fullWidth onClick={() => setSecurityDialogOpen(true)}>
                       Manage
                     </Button>
                   </CardActions>
                 </Card>
               </Grid>
              </Grid>
            </Box>
          )}

          {/* Digital Wallet Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 0 }}>
              <DigitalWalletDashboard
                onQRGenerate={() => setQrGeneratorDialogOpen(true)}
                onQRScan={() => setQrScannerDialogOpen(true)}
                onP2PTransfer={() => setP2pTransferDialogOpen(true)}
                onMerchantPay={() => setMerchantPaymentDialogOpen(true)}
                onViewHistory={() => setWalletHistoryDialogOpen(true)}
                onAddMoney={() => setAddMoneyDialogOpen(true)}
              />
            </Box>
          )}

          {/* Investments Tab */}
          {tabValue === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Investment Portfolio
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ShowChart sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Box>
                          <Typography variant="h6">Portfolio Value</Typography>
                          <Typography variant="h4" color="primary">$45,250.80</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        +$2,450.30 (+5.73%) this month
                      </Typography>
                      <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
                    </CardContent>
                    <CardActions>
                      <Button fullWidth onClick={() => setInvestmentDialogOpen(true)}>
                        View Portfolio
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                        <Box>
                          <Typography variant="h6">Top Performer</Typography>
                          <Typography variant="h4" color="success.main">AAPL</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Apple Inc. +4.14% today
                      </Typography>
                      <Button variant="outlined" size="small">View Details</Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Loans & Credit Tab */}
          {tabValue === 4 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Loans & Credit
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Calculate sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                        <Typography variant="h6">Loan Calculator</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Calculate monthly payments for loans and mortgages
                      </Typography>
                      <Button fullWidth onClick={() => setLoanCalculatorDialogOpen(true)}>
                        Calculate Loan
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Current Loans</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Auto Loan"
                            secondary="Balance: $18,500 • Payment: $450/month"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Student Loan"
                            secondary="Balance: $32,000 • Payment: $380/month"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Budget & Analytics Tab */}
          {tabValue === 5 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Budget & Analytics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PieChart sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                        <Typography variant="h6">Budget Tracker</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Track your spending and manage your budget
                      </Typography>
                      <Button fullWidth onClick={() => setBudgetTrackerDialogOpen(true)}>
                        View Budget
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Spending Summary</Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">This Month</Typography>
                        <Typography variant="h4" color="primary">$3,275</Typography>
                        <Typography variant="caption" color="text.secondary">of $5,000 budget</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={65.5} sx={{ height: 8, borderRadius: 4 }} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Crypto & Digital Assets Tab */}
          {tabValue === 6 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Crypto Portfolio</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CurrencyBitcoin sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Box>
                          <Typography variant="h6">Portfolio Value</Typography>
                          <Typography variant="h4" color="primary">$7,609.82</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        +$1,234.56 (+19.4%) this month
                      </Typography>
                      <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
                    </CardContent>
                    <CardActions>
                      <Button fullWidth onClick={() => setCryptoDialogOpen(true)}>
                        Manage Portfolio
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Top Performers</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Bitcoin (BTC)</Typography>
                        <Typography variant="body2" color="success.main">+2.34%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Solana (SOL)</Typography>
                        <Typography variant="body2" color="success.main">+8.92%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Cardano (ADA)</Typography>
                        <Typography variant="body2" color="success.main">+5.67%</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* International Banking Tab */}
          {tabValue === 7 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>International Banking</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Language sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Box>
                          <Typography variant="h6">Exchange Rates</Typography>
                          <Typography variant="h4" color="primary">Live</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Real-time currency conversion
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button fullWidth onClick={() => setInternationalTransferDialogOpen(true)}>
                        Send International Transfer
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Supported Currencies</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip label="EUR" size="small" />
                        <Chip label="GBP" size="small" />
                        <Chip label="JPY" size="small" />
                        <Chip label="CAD" size="small" />
                        <Chip label="AUD" size="small" />
                        <Chip label="CHF" size="small" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* AI Insights Tab */}
          {tabValue === 8 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>AI Financial Insights</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SmartToy sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Box>
                          <Typography variant="h6">Financial Health</Typography>
                          <Typography variant="h4" color="primary">85/100</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Excellent financial health score
                      </Typography>
                      <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                    </CardContent>
                    <CardActions>
                      <Button fullWidth onClick={() => setAiInsightsDialogOpen(true)}>
                        View Insights
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Smart Recommendations</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        AI-powered financial advice and spending insights
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Chip label="Spending Analysis" size="small" color="primary" />
                        <Chip label="Savings Opportunities" size="small" color="success" />
                        <Chip label="Investment Tips" size="small" color="info" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Wallet Security Tab */}
          {tabValue === 9 && (
            <Box sx={{ p: 0 }}>
              <WalletSecurityDashboard
                onManagePin={() => setPinManagementDialogOpen(true)}
                onSpendingLimits={() => setSpendingLimitsDialogOpen(true)}
                onNotificationSettings={() => setNotificationSettingsDialogOpen(true)}
                onViewActivity={() => setSecurityActivityDialogOpen(true)}
              />
            </Box>
          )}

          {/* Account Security Tab */}
          {tabValue === 10 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Security Status
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip label="Two-Factor Authentication" color="success" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="success.main">Active</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip label="Biometric Login" color="success" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="success.main">Enabled</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip label="Fraud Alerts" color="success" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="success.main">Active</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Login Activity
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Login from Mobile App"
                            secondary="Today, 2:30 PM • New York, NY"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Login from Web Browser"
                            secondary="Yesterday, 10:15 AM • New York, NY"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Login from Mobile App"
                            secondary="Jan 14, 2024 • New York, NY"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

                  {/* Support Tab */}
                  {tabValue === 11 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Support
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chat sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h6">Get Help</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Contact our customer support team for assistance
                      </Typography>
                      <Button fullWidth onClick={() => setCustomerSupportDialogOpen(true)}>
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Quick Support</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><Phone /></ListItemIcon>
                          <ListItemText primary="1-800-BANK-123" secondary="24/7 Phone Support" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Email /></ListItemIcon>
                          <ListItemText primary="support@bank.com" secondary="Email Support" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocationOn /></ListItemIcon>
                          <ListItemText primary="Find Branch" secondary="Locate nearest branch" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          {/* Personal Finance Tab */}
          {tabValue === 12 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Personal Finance Dashboard</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <GoalTracking />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SavingsChallenges />
                </Grid>
                <Grid item xs={12}>
                  <FinancialWellnessScore />
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

          {/* Transfer Dialog */}
        <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              label="Transfer To"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              placeholder="Account number or email"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTransferDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleTransfer} variant="contained">Transfer</Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              label="Pay To"
              value={paymentTo}
              onChange={(e) => setPaymentTo(e.target.value)}
              placeholder="Payee name or account"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePayment} variant="contained">Pay</Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Banking Components */}
        <BillPaymentComponent 
          open={billPaymentDialogOpen} 
          onClose={() => setBillPaymentDialogOpen(false)} 
        />
        <StatementComponent 
          open={statementDialogOpen} 
          onClose={() => setStatementDialogOpen(false)} 
        />
        <SecuritySettingsComponent 
          open={securityDialogOpen} 
          onClose={() => setSecurityDialogOpen(false)} 
        />
        <InvestmentPortfolioComponent 
          open={investmentDialogOpen} 
          onClose={() => setInvestmentDialogOpen(false)} 
        />
        <LoanCalculatorComponent 
          open={loanCalculatorDialogOpen} 
          onClose={() => setLoanCalculatorDialogOpen(false)} 
        />
        <BudgetTrackerComponent 
          open={budgetTrackerDialogOpen} 
          onClose={() => setBudgetTrackerDialogOpen(false)} 
        />
        <CustomerSupportComponent
          open={customerSupportDialogOpen}
          onClose={() => setCustomerSupportDialogOpen(false)}
        />
        <CryptoPortfolioComponent
          open={cryptoDialogOpen}
          onClose={() => setCryptoDialogOpen(false)}
        />
        <InternationalTransferComponent
          open={internationalTransferDialogOpen}
          onClose={() => setInternationalTransferDialogOpen(false)}
        />
        <AIInsightsComponent
          open={aiInsightsDialogOpen}
          onClose={() => setAiInsightsDialogOpen(false)}
        />

        {/* Digital Wallet Components */}
        <QRCodeGeneratorComponent
          open={qrGeneratorDialogOpen}
          onClose={() => setQrGeneratorDialogOpen(false)}
        />
        <QRCodeScannerComponent
          open={qrScannerDialogOpen}
          onClose={() => setQrScannerDialogOpen(false)}
        />
        <P2PTransferComponent
          open={p2pTransferDialogOpen}
          onClose={() => setP2pTransferDialogOpen(false)}
        />
        <MerchantPaymentComponent
          open={merchantPaymentDialogOpen}
          onClose={() => setMerchantPaymentDialogOpen(false)}
        />
        <WalletTransactionHistoryComponent
          open={walletHistoryDialogOpen}
          onClose={() => setWalletHistoryDialogOpen(false)}
        />

        {/* Wallet Security Components */}
        <PINManagementComponent
          open={pinManagementDialogOpen}
          onClose={() => setPinManagementDialogOpen(false)}
        />
        <SpendingLimitsComponent
          open={spendingLimitsDialogOpen}
          onClose={() => setSpendingLimitsDialogOpen(false)}
        />
        <NotificationSettingsComponent
          open={notificationSettingsDialogOpen}
          onClose={() => setNotificationSettingsDialogOpen(false)}
        />
        <SecurityActivityComponent
          open={securityActivityDialogOpen}
          onClose={() => setSecurityActivityDialogOpen(false)}
        />

        {/* Add Money Dialog (Simple implementation) */}
        <Dialog open={addMoneyDialogOpen} onClose={() => setAddMoneyDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Money to Wallet</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add money from your linked bank account to your digital wallet.
            </Typography>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              sx={{ mb: 2, mt: 1 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />
            <TextField
              fullWidth
              label="From Account"
              value="Checking Account (****1234)"
              disabled
              helperText="Linked bank account"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddMoneyDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                setSnackbarMessage('$100 added to your digital wallet successfully!');
                setSnackbarOpen(true);
                setAddMoneyDialogOpen(false);
              }}
            >
              Add Money
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default BankingPortalPage; 
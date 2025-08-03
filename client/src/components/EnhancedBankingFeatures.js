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
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add,
  Chat,
  Phone,
  Email,
  LocationOn,
  Schedule
} from '@mui/icons-material';

// Mock data for enhanced features
const mockInvestments = [
  { id: 1, name: "S&P 500 ETF", symbol: "SPY", shares: 25, avgPrice: 420.50, currentPrice: 445.75, change: 6.01, changePercent: 1.37, sector: "ETF" },
  { id: 2, name: "Apple Inc.", symbol: "AAPL", shares: 10, avgPrice: 175.20, currentPrice: 182.45, change: 7.25, changePercent: 4.14, sector: "Technology" },
  { id: 3, name: "Tesla Inc.", symbol: "TSLA", shares: 5, avgPrice: 240.00, currentPrice: 235.80, change: -4.20, changePercent: -1.75, sector: "Automotive" },
  { id: 4, name: "Microsoft Corp.", symbol: "MSFT", shares: 8, avgPrice: 310.50, currentPrice: 325.20, change: 14.70, changePercent: 4.73, sector: "Technology" }
];

const mockBudget = {
  monthly: 5000,
  categories: [
    { name: "Housing", budget: 1500, spent: 1450, color: "#1976d2" },
    { name: "Transportation", budget: 500, spent: 480, color: "#388e3c" },
    { name: "Food", budget: 600, spent: 520, color: "#f57c00" },
    { name: "Entertainment", budget: 300, spent: 280, color: "#7b1fa2" },
    { name: "Utilities", budget: 200, spent: 185, color: "#d32f2f" },
    { name: "Healthcare", budget: 400, spent: 350, color: "#1976d2" }
  ]
};

const mockLoans = [
  { id: 1, type: "Auto Loan", balance: 18500, payment: 450, rate: 4.25, term: 48, nextPayment: "2024-02-15" },
  { id: 2, type: "Student Loan", balance: 32000, payment: 380, rate: 5.75, term: 120, nextPayment: "2024-02-20" }
];

export const InvestmentPortfolioComponent = ({ open, onClose }) => {
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [orderAmount, setOrderAmount] = useState("");
  const [processingOrder, setProcessingOrder] = useState(false);

  const totalValue = mockInvestments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0);
  const totalGain = mockInvestments.reduce((sum, inv) => sum + (inv.shares * (inv.currentPrice - inv.avgPrice)), 0);
  const totalGainPercent = ((totalGain / (totalValue - totalGain)) * 100).toFixed(2);

  const handleBuy = async () => {
    if (selectedInvestment && orderAmount) {
      setProcessingOrder(true);
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbarMessage(`Buy order for ${orderAmount} shares of ${selectedInvestment.symbol} placed successfully!`);
      setSnackbarOpen(true);
      setProcessingOrder(false);
      setBuyDialogOpen(false);
      setSelectedInvestment(null);
      setOrderAmount("");
    }
  };

  const handleSell = async () => {
    if (selectedInvestment && orderAmount) {
      setProcessingOrder(true);
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbarMessage(`Sell order for ${orderAmount} shares of ${selectedInvestment.symbol} placed successfully!`);
      setSnackbarOpen(true);
      setProcessingOrder(false);
      setSellDialogOpen(false);
      setSelectedInvestment(null);
      setOrderAmount("");
    }
  };

  const handleQuickTrade = (investment, action) => {
    setSelectedInvestment(investment);
    setOrderAmount("1");
    if (action === 'buy') {
      setBuyDialogOpen(true);
    } else {
      setSellDialogOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Investment Portfolio</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Portfolio Summary */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Portfolio Summary</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="h4" color="primary">${totalValue.toLocaleString()}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Value</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="h4" color={totalGain >= 0 ? "success.main" : "error.main"}>
                        ${totalGain.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Gain/Loss</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="h4" color={totalGainPercent >= 0 ? "success.main" : "error.main"}>
                        {totalGainPercent}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Return</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setBuyDialogOpen(true)}
                        fullWidth
                      >
                        Buy
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Holdings Table */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Holdings</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Stock</TableCell>
                      <TableCell>Shares</TableCell>
                      <TableCell>Avg Price</TableCell>
                      <TableCell>Current Price</TableCell>
                      <TableCell>Change</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockInvestments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{investment.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{investment.symbol}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{investment.shares}</TableCell>
                        <TableCell>${investment.avgPrice}</TableCell>
                        <TableCell>${investment.currentPrice}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {investment.change >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                            <Typography
                              variant="body2"
                              color={investment.change >= 0 ? "success.main" : "error.main"}
                            >
                              ${investment.change} ({investment.changePercent}%)
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>${(investment.shares * investment.currentPrice).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => handleQuickTrade(investment, 'sell')}>Sell</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onClose={() => setBuyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Buy Stock</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Select Investment</InputLabel>
            <Select
              value={selectedInvestment ? selectedInvestment.symbol : ''}
              label="Select Investment"
              onChange={(e) => {
                const inv = mockInvestments.find(i => i.symbol === e.target.value);
                setSelectedInvestment(inv);
              }}
            >
              {mockInvestments.map((investment) => (
                <MenuItem key={investment.symbol} value={investment.symbol}>
                  {investment.name} ({investment.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Number of Shares"
            type="number"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price per Share"
            type="number"
            value={selectedInvestment ? selectedInvestment.currentPrice : ''}
            disabled
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBuy} 
            variant="contained"
            disabled={!selectedInvestment || !orderAmount || processingOrder}
            startIcon={processingOrder ? <LinearProgress size={16} /> : null}
          >
            {processingOrder ? 'Processing...' : 'Buy'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onClose={() => setSellDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sell Stock</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Select Investment</InputLabel>
            <Select
              value={selectedInvestment ? selectedInvestment.symbol : ''}
              label="Select Investment"
              onChange={(e) => {
                const inv = mockInvestments.find(i => i.symbol === e.target.value);
                setSelectedInvestment(inv);
              }}
            >
              {mockInvestments.map((investment) => (
                <MenuItem key={investment.symbol} value={investment.symbol}>
                  {investment.name} ({investment.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Number of Shares"
            type="number"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price per Share"
            type="number"
            value={selectedInvestment ? selectedInvestment.currentPrice : ''}
            disabled
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSellDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSell} 
            variant="contained"
            disabled={!selectedInvestment || !orderAmount || processingOrder}
            startIcon={processingOrder ? <LinearProgress size={16} /> : null}
          >
            {processingOrder ? 'Processing...' : 'Sell'}
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

export const LoanCalculatorComponent = ({ open, onClose }) => {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [loanType, setLoanType] = useState('auto');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [applyingLoan, setApplyingLoan] = useState(false);

  useEffect(() => {
    const rate = interestRate / 100 / 12;
    const payments = loanTerm;
    const payment = (loanAmount * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
    const total = payment * payments;
    const interest = total - loanAmount;

    setMonthlyPayment(payment);
    setTotalPayment(total);
    setTotalInterest(interest);
  }, [loanAmount, interestRate, loanTerm]);

  const handleApplyLoan = async () => {
    setApplyingLoan(true);
    
    // Simulate loan application processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setSnackbarMessage(`Loan application for $${loanAmount.toLocaleString()} ${loanType} loan submitted successfully!`);
    setSnackbarOpen(true);
    setApplyingLoan(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Loan Calculator</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Loan Parameters</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Loan Type</InputLabel>
                <Select
                  value={loanType}
                  label="Loan Type"
                  onChange={(e) => setLoanType(e.target.value)}
                >
                  <MenuItem value="auto">Auto Loan</MenuItem>
                  <MenuItem value="home">Home Loan</MenuItem>
                  <MenuItem value="personal">Personal Loan</MenuItem>
                  <MenuItem value="student">Student Loan</MenuItem>
                  <MenuItem value="business">Business Loan</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Loan Amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                sx={{ mb: 2 }}
              />
              <Typography gutterBottom>Interest Rate: {interestRate}%</Typography>
              <Slider
                value={interestRate}
                onChange={(e, value) => setInterestRate(value)}
                min={1}
                max={15}
                step={0.1}
                sx={{ mb: 2 }}
              />
              <Typography gutterBottom>Loan Term: {loanTerm} months</Typography>
              <Slider
                value={loanTerm}
                onChange={(e, value) => setLoanTerm(value)}
                min={12}
                max={360}
                step={12}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Payment Summary</Typography>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" color="primary">${monthlyPayment.toFixed(2)}</Typography>
                    <Typography variant="body2" color="text.secondary">Monthly Payment</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1">Total Payment: ${totalPayment.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1">Total Interest: ${totalInterest.toFixed(2)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">Loan Amount: ${loanAmount.toFixed(2)}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Your Current Loans</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Loan Type</TableCell>
                      <TableCell>Balance</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Next Payment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell>{loan.type}</TableCell>
                        <TableCell>${loan.balance.toLocaleString()}</TableCell>
                        <TableCell>${loan.payment}</TableCell>
                        <TableCell>{loan.rate}%</TableCell>
                        <TableCell>{loan.nextPayment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button 
            variant="contained" 
            onClick={handleApplyLoan}
            disabled={applyingLoan}
            startIcon={applyingLoan ? <LinearProgress size={16} /> : null}
          >
            {applyingLoan ? 'Processing...' : 'Apply for Loan'}
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

export const BudgetTrackerComponent = ({ open, onClose }) => {
  const totalBudget = mockBudget.categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = mockBudget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Budget Tracker</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Budget Summary */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Monthly Budget Summary</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h4" color="primary">${totalBudget.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Budget</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h4" color="error.main">${totalSpent.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h4" color="success.main">${remainingBudget.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Remaining</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <LinearProgress
                      variant="determinate"
                      value={(totalSpent / totalBudget) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {((totalSpent / totalBudget) * 100).toFixed(1)}% Used
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Budget Categories */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Budget Categories</Typography>
            <Grid container spacing={2}>
              {mockBudget.categories.map((category, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">{category.name}</Typography>
                        <Chip
                          label={`$${category.spent} / $${category.budget}`}
                          color={category.spent > category.budget ? "error" : "success"}
                          size="small"
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(category.spent / category.budget) * 100}
                        sx={{ height: 6, borderRadius: 3, mb: 1 }}
                        color={category.spent > category.budget ? "error" : "primary"}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {((category.spent / category.budget) * 100).toFixed(1)}% used
                      </Typography>
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
  );
};

export const CustomerSupportComponent = ({ open, onClose }) => {
  const [selectedSupport, setSelectedSupport] = useState('chat');
  const [message, setMessage] = useState('');

  const supportOptions = [
    { id: 'chat', title: 'Live Chat', icon: <Chat />, description: 'Chat with a representative' },
    { id: 'phone', title: 'Call Us', icon: <Phone />, description: 'Speak with customer service' },
    { id: 'email', title: 'Email Support', icon: <Email />, description: 'Send us an email' },
    { id: 'branch', title: 'Find Branch', icon: <LocationOn />, description: 'Locate nearest branch' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Customer Support</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Support Options</Typography>
            <List>
              {supportOptions.map((option) => (
                <ListItem
                  key={option.id}
                  button
                  selected={selectedSupport === option.id}
                  onClick={() => setSelectedSupport(option.id)}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <ListItemText
                    primary={option.title}
                    secondary={option.description}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={8}>
            {selectedSupport === 'chat' && (
              <Box>
                <Typography variant="h6" gutterBottom>Live Chat</Typography>
                <Paper variant="outlined" sx={{ p: 2, height: 300, overflow: 'auto' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Agent: Hello! How can I help you today?
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="primary">
                      You: I have a question about my account
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Paper>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" sx={{ mr: 1 }}>Send</Button>
                  <Button variant="outlined">End Chat</Button>
                </Box>
              </Box>
            )}

            {selectedSupport === 'phone' && (
              <Box>
                <Typography variant="h6" gutterBottom>Call Support</Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" color="primary" gutterBottom>
                      1-800-BANK-123
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Available 24/7 for your banking needs
                    </Typography>
                    <Button variant="contained" startIcon={<Phone />} sx={{ mr: 2 }}>
                      Call Now
                    </Button>
                    <Button variant="outlined" startIcon={<Schedule />}>
                      Schedule Call
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            )}

            {selectedSupport === 'email' && (
              <Box>
                <Typography variant="h6" gutterBottom>Email Support</Typography>
                <TextField
                  fullWidth
                  label="Subject"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Message"
                  sx={{ mb: 2 }}
                />
                <Button variant="contained">Send Email</Button>
              </Box>
            )}

            {selectedSupport === 'branch' && (
              <Box>
                <Typography variant="h6" gutterBottom>Find Branch</Typography>
                <TextField
                  fullWidth
                  label="Enter ZIP Code"
                  sx={{ mb: 2 }}
                />
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Nearest Branch</Typography>
                    <Typography variant="body1">123 Main Street</Typography>
                    <Typography variant="body2" color="text.secondary">New York, NY 10001</Typography>
                    <Typography variant="body2" color="text.secondary">Open: 9:00 AM - 5:00 PM</Typography>
                    <Button variant="outlined" startIcon={<LocationOn />} sx={{ mt: 1 }}>
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}; 
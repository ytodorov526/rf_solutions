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
  Snackbar
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  Payment,
  Receipt,
  TrendingUp,
  Security,
  Notifications,
  Settings,
  Download,
  Print
} from '@mui/icons-material';
import jsPDF from 'jspdf';

// Mock data for enhanced banking features
const mockBills = [
  { id: 1, name: "Electricity Bill", amount: 125.50, dueDate: "2024-01-25", status: "pending" },
  { id: 2, name: "Internet Service", amount: 89.99, dueDate: "2024-01-28", status: "paid" },
  { id: 3, name: "Phone Bill", amount: 65.00, dueDate: "2024-02-05", status: "pending" },
  { id: 4, name: "Insurance Premium", amount: 245.00, dueDate: "2024-02-10", status: "pending" }
];

const mockStatements = [
  { month: "January 2024", balance: 2547.89, transactions: 23, status: "available" },
  { month: "December 2023", balance: 1987.45, transactions: 31, status: "available" },
  { month: "November 2023", balance: 2156.78, transactions: 28, status: "available" }
];

export const BillPaymentComponent = ({ open, onClose }) => {
  const [selectedBill, setSelectedBill] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const handlePayment = async () => {
    if (selectedBill && paymentAmount && paymentMethod) {
      setProcessingPayment(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbarMessage(`Successfully paid $${paymentAmount} for ${selectedBill} using ${paymentMethod}`);
      setSnackbarOpen(true);
      setProcessingPayment(false);
      
      // Reset form
      setSelectedBill('');
      setPaymentAmount('');
      setPaymentMethod('');
      
      // Close dialog after a delay
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleQuickPay = (bill) => {
    setSelectedBill(bill.name);
    setPaymentAmount(bill.amount.toString());
    setPaymentMethod('checking');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Pay Bills</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Upcoming Bills
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Bill Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>{bill.name}</TableCell>
                        <TableCell>${bill.amount}</TableCell>
                        <TableCell>{bill.dueDate}</TableCell>
                        <TableCell>
                          <Chip 
                            label={bill.status} 
                            color={bill.status === 'paid' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => handleQuickPay(bill)}
                            disabled={bill.status === 'paid'}
                          >
                            {bill.status === 'paid' ? 'Paid' : 'Pay Now'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Make Payment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bill Name"
                    value={selectedBill}
                    onChange={(e) => setSelectedBill(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      label="Payment Method"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <MenuItem value="checking">Checking Account</MenuItem>
                      <MenuItem value="savings">Savings Account</MenuItem>
                      <MenuItem value="credit">Credit Card</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handlePayment} 
            variant="contained" 
            disabled={!selectedBill || !paymentAmount || !paymentMethod || processingPayment}
            startIcon={processingPayment ? <LinearProgress size={16} /> : null}
          >
            {processingPayment ? 'Processing...' : 'Pay Bill'}
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

export const StatementComponent = ({ open, onClose }) => {
  const [selectedStatement, setSelectedStatement] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Enhanced mock data with more realistic transaction details
  const mockTransactions = {
    "January 2024": [
      { date: "2024-01-15", description: "Grocery Store", amount: -45.67, type: "debit", category: "Food" },
      { date: "2024-01-14", description: "Salary Deposit", amount: 2500.00, type: "credit", category: "Income" },
      { date: "2024-01-13", description: "Gas Station", amount: -89.99, type: "debit", category: "Transportation" },
      { date: "2024-01-12", description: "Online Purchase", amount: -125.50, type: "debit", category: "Shopping" },
      { date: "2024-01-11", description: "Refund", amount: 150.00, type: "credit", category: "Refund" },
      { date: "2024-01-10", description: "Restaurant", amount: -67.89, type: "debit", category: "Food" },
      { date: "2024-01-09", description: "ATM Withdrawal", amount: -200.00, type: "debit", category: "ATM" },
      { date: "2024-01-08", description: "Utility Bill", amount: -145.30, type: "debit", category: "Utilities" },
      { date: "2024-01-07", description: "Interest Earned", amount: 12.45, type: "credit", category: "Interest" },
      { date: "2024-01-06", description: "Movie Theater", amount: -35.00, type: "debit", category: "Entertainment" },
      { date: "2024-01-05", description: "Pharmacy", amount: -23.45, type: "debit", category: "Healthcare" },
      { date: "2024-01-04", description: "Coffee Shop", amount: -8.75, type: "debit", category: "Food" },
      { date: "2024-01-03", description: "Transfer from Savings", amount: 500.00, type: "credit", category: "Transfer" },
      { date: "2024-01-02", description: "Insurance Payment", amount: -89.99, type: "debit", category: "Insurance" },
      { date: "2024-01-01", description: "New Year's Dinner", amount: -156.78, type: "debit", category: "Food" }
    ]
  };

  const generateStatementContent = (month) => {
    const transactions = mockTransactions[month] || [];
    const totalCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netChange = totalCredits - totalDebits;
    const openingBalance = 1987.45; // Previous month's closing balance
    const closingBalance = openingBalance + netChange;
    const interestEarned = 12.45;
    const fees = 0.00;

    return {
      transactions,
      summary: {
        openingBalance,
        closingBalance,
        totalCredits,
        totalDebits,
        netChange,
        interestEarned,
        fees
      }
    };
  };

  const downloadStatement = (month) => {
    const content = generateStatementContent(month);
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Set up fonts and colors
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210); // Blue color for header
    doc.text('ELUVION BANK', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Account Statement', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(month, 105, 40, { align: 'center' });
    
    // Account Information Section
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('Account Information', 20, 60);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Account Holder: John Smith', 20, 70);
    doc.text('Account Number: ****1234', 20, 77);
    doc.text('Account Type: Checking', 20, 84);
    doc.text(`Statement Period: ${month}`, 20, 91);
    
    // Account Summary Section
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('Account Summary', 20, 110);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Opening Balance: $${content.summary.openingBalance.toFixed(2)}`, 20, 120);
    doc.text(`Total Credits: $${content.summary.totalCredits.toFixed(2)}`, 20, 127);
    doc.text(`Total Debits: $${content.summary.totalDebits.toFixed(2)}`, 20, 134);
    doc.text(`Net Change: $${content.summary.netChange.toFixed(2)}`, 20, 141);
    doc.text(`Interest Earned: $${content.summary.interestEarned.toFixed(2)}`, 20, 148);
    doc.text(`Fees: $${content.summary.fees.toFixed(2)}`, 20, 155);
    doc.text(`Closing Balance: $${content.summary.closingBalance.toFixed(2)}`, 20, 162);
    
    // Transaction History Section
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('Transaction History', 20, 180);
    
    // Table headers
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(25, 118, 210);
    doc.rect(20, 185, 170, 8, 'F');
    doc.text('Date', 25, 191);
    doc.text('Description', 50, 191);
    doc.text('Category', 120, 191);
    doc.text('Amount', 150, 191);
    
    // Transaction rows
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    let yPosition = 200;
    
    content.transactions.forEach((transaction, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, yPosition - 5, 170, 8, 'F');
      }
      
      doc.text(transaction.date, 25, yPosition);
      doc.text(transaction.description.substring(0, 20), 50, yPosition);
      doc.text(transaction.category, 120, yPosition);
      
      // Color code amounts
      if (transaction.type === 'credit') {
        doc.setTextColor(0, 128, 0); // Green for credits
        doc.text(`+$${Math.abs(transaction.amount).toFixed(2)}`, 150, yPosition);
      } else {
        doc.setTextColor(255, 0, 0); // Red for debits
        doc.text(`-$${Math.abs(transaction.amount).toFixed(2)}`, 150, yPosition);
      }
      
      doc.setTextColor(0, 0, 0);
      yPosition += 8;
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('This statement is provided by Eluvion Bank for your records.', 20, 280);
      doc.text('For questions about this statement, please contact customer service at 1-800-ELUVION.', 20, 285);
      doc.text('© 2024 Eluvion Bank. All rights reserved.', 20, 290);
      
      // Page number
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`Eluvion_Bank_Statement_${month.replace(' ', '_')}.pdf`);
    
    setSnackbarMessage(`Statement for ${month} downloaded as PDF successfully!`);
    setSnackbarOpen(true);
  };

  const printStatement = (month) => {
    const content = generateStatementContent(month);
    
    // Create PDF document for printing
    const doc = new jsPDF();
    
    // Set up fonts and colors
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210); // Blue color for header
    doc.text('ELUVION BANK', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Account Statement', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(month, 105, 40, { align: 'center' });
    
    // Account Information Section
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('Account Information', 20, 60);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Account Holder: John Smith', 20, 70);
    doc.text('Account Number: ****1234', 20, 77);
    doc.text('Account Type: Checking', 20, 84);
    doc.text(`Statement Period: ${month}`, 20, 91);
    
    // Account Summary Section
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('Account Summary', 20, 110);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Opening Balance: $${content.summary.openingBalance.toFixed(2)}`, 20, 120);
    doc.text(`Total Credits: $${content.summary.totalCredits.toFixed(2)}`, 20, 127);
    doc.text(`Total Debits: $${content.summary.totalDebits.toFixed(2)}`, 20, 134);
    doc.text(`Net Change: $${content.summary.netChange.toFixed(2)}`, 20, 141);
    doc.text(`Interest Earned: $${content.summary.interestEarned.toFixed(2)}`, 20, 148);
    doc.text(`Fees: $${content.summary.fees.toFixed(2)}`, 20, 155);
    doc.text(`Closing Balance: $${content.summary.closingBalance.toFixed(2)}`, 20, 162);
    
    // Transaction History Section
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('Transaction History', 20, 180);
    
    // Table headers
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(25, 118, 210);
    doc.rect(20, 185, 170, 8, 'F');
    doc.text('Date', 25, 191);
    doc.text('Description', 50, 191);
    doc.text('Category', 120, 191);
    doc.text('Amount', 150, 191);
    
    // Transaction rows
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    let yPosition = 200;
    
    content.transactions.forEach((transaction, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, yPosition - 5, 170, 8, 'F');
      }
      
      doc.text(transaction.date, 25, yPosition);
      doc.text(transaction.description.substring(0, 20), 50, yPosition);
      doc.text(transaction.category, 120, yPosition);
      
      // Color code amounts
      if (transaction.type === 'credit') {
        doc.setTextColor(0, 128, 0); // Green for credits
        doc.text(`+$${Math.abs(transaction.amount).toFixed(2)}`, 150, yPosition);
      } else {
        doc.setTextColor(255, 0, 0); // Red for debits
        doc.text(`-$${Math.abs(transaction.amount).toFixed(2)}`, 150, yPosition);
      }
      
      doc.setTextColor(0, 0, 0);
      yPosition += 8;
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('This statement is provided by Eluvion Bank for your records.', 20, 280);
      doc.text('For questions about this statement, please contact customer service at 1-800-ELUVION.', 20, 285);
      doc.text('© 2024 Eluvion Bank. All rights reserved.', 20, 290);
      
      // Page number
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    // Open PDF in new window for printing
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);
    
    setSnackbarMessage(`Statement for ${month} opened for printing!`);
    setSnackbarOpen(true);
  };



  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Account Statements</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Available Statements
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockStatements.map((statement, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{statement.month}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Balance: ${statement.balance}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Transactions: {statement.transactions}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          variant="outlined"
                          sx={{ mr: 1 }}
                          onClick={() => downloadStatement(statement.month)}
                        >
                          Download
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Print />}
                          variant="outlined"
                          onClick={() => printStatement(statement.month)}
                        >
                          Print
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Statement Details
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, height: 400, overflow: 'auto' }}>
                <Typography variant="body2" paragraph>
                  Select a statement from the left to view detailed transaction history.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your statements include:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Complete transaction history
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Account balances and interest earned
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Fees and charges breakdown
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Regulatory disclosures
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  <strong>Eluvion Bank</strong> - Your trusted financial partner since 1995
                </Typography>
              </Paper>
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

export const SecuritySettingsComponent = ({ open, onClose }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [fraudAlertsEnabled, setFraudAlertsEnabled] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSaveSettings = () => {
    setSnackbarOpen(true);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Security Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Authentication Methods
              </Typography>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">Two-Factor Authentication</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add an extra layer of security to your account
                      </Typography>
                    </Box>
                    <Button
                      variant={twoFactorEnabled ? "contained" : "outlined"}
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    >
                      {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">Biometric Login</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use fingerprint or face recognition for login
                      </Typography>
                    </Box>
                    <Button
                      variant={biometricEnabled ? "contained" : "outlined"}
                      onClick={() => setBiometricEnabled(!biometricEnabled)}
                    >
                      {biometricEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Alerts & Notifications
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">Fraud Alerts</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get notified of suspicious account activity
                      </Typography>
                    </Box>
                    <Button
                      variant={fraudAlertsEnabled ? "contained" : "outlined"}
                      onClick={() => setFraudAlertsEnabled(!fraudAlertsEnabled)}
                    >
                      {fraudAlertsEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Security Score
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>95%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Excellent security score
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={95} sx={{ height: 8, borderRadius: 4 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Your account is well-protected with multiple security layers
                  </Typography>
                </CardContent>
              </Card>
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
          Security settings updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}; 
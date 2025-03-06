import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Tooltip,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Crossword puzzle data - petroleum and chemical engineering themed
const puzzleData = {
  beginner: {
    gridSize: 12,
    words: [
      {
        word: "DISTILLATION",
        clue: "Process that separates crude oil into fractions based on boiling points",
        direction: "across",
        row: 0,
        col: 0,
      },
      {
        word: "CATALYST",
        clue: "Substance that speeds up a chemical reaction without being consumed",
        direction: "down",
        row: 0,
        col: 3,
      },
      {
        word: "CRUDE",
        clue: "Unrefined petroleum",
        direction: "across",
        row: 3,
        col: 3,
      },
      {
        word: "OCTANE",
        clue: "Rating that measures a fuel's resistance to engine knocking",
        direction: "down",
        row: 1,
        col: 7,
      },
      {
        word: "REFINERY",
        clue: "Industrial facility that transforms crude oil into useful products",
        direction: "across",
        row: 6,
        col: 1,
      },
      {
        word: "POLYMER",
        clue: "Large molecule composed of repeating structural units",
        direction: "down",
        row: 5,
        col: 1,
      },
      {
        word: "CRACKING",
        clue: "Process that breaks large hydrocarbons into smaller ones",
        direction: "across",
        row: 9,
        col: 2,
      },
    ]
  },
  intermediate: {
    gridSize: 15,
    words: [
      {
        word: "FRACTIONATION",
        clue: "Separation process based on differences in boiling points",
        direction: "across",
        row: 0,
        col: 1,
      },
      {
        word: "HYDROCRACKING",
        clue: "Catalytic cracking process performed in the presence of hydrogen",
        direction: "down",
        row: 0,
        col: 5,
      },
      {
        word: "REFORMING",
        clue: "Process that converts naphtha into higher-octane components",
        direction: "across",
        row: 4,
        col: 0,
      },
      {
        word: "ISOMERIZATION",
        clue: "Process that rearranges the structure of molecules without changing their formula",
        direction: "across",
        row: 8,
        col: 0,
      },
      {
        word: "POLYETHYLENE",
        clue: "Most common plastic, made from ethylene monomers",
        direction: "down",
        row: 1,
        col: 10,
      },
      {
        word: "ALKYLATION",
        clue: "Process that combines light olefins with isobutane",
        direction: "down",
        row: 3,
        col: 3,
      },
      {
        word: "VISCOSITY",
        clue: "Measure of a fluid's resistance to flow",
        direction: "across",
        row: 12,
        col: 3,
      },
    ]
  }
};

function ChemistryCrossword() {
  const [difficulty, setDifficulty] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [grid, setGrid] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const [hints, setHints] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [currentHintWord, setCurrentHintWord] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Initialize puzzle based on difficulty
  const initializePuzzle = (difficultyLevel) => {
    setDifficulty(difficultyLevel);
    const puzzleTemplate = puzzleData[difficultyLevel];
    setPuzzle(puzzleTemplate);
    
    // Create empty grid
    const emptyGrid = Array(puzzleTemplate.gridSize).fill().map(() => 
      Array(puzzleTemplate.gridSize).fill(null)
    );
    
    // Add word cell information to grid
    puzzleTemplate.words.forEach((wordData, wordIndex) => {
      const { word, direction, row, col } = wordData;
      
      for (let i = 0; i < word.length; i++) {
        const cellRow = direction === 'across' ? row : row + i;
        const cellCol = direction === 'across' ? col + i : col;
        
        // Skip if out of bounds
        if (cellRow >= puzzleTemplate.gridSize || cellCol >= puzzleTemplate.gridSize) {
          continue;
        }
        
        // Mark the cell as part of a word
        emptyGrid[cellRow][cellCol] = {
          isActive: true,
          wordIds: emptyGrid[cellRow][cellCol]?.wordIds 
            ? [...emptyGrid[cellRow][cellCol].wordIds, wordIndex] 
            : [wordIndex],
          // Add number label only to first letter of each word
          number: (direction === 'across' && i === 0) || (direction === 'down' && i === 0) 
            ? getWordNumber(wordIndex, puzzleTemplate.words) 
            : emptyGrid[cellRow][cellCol]?.number,
          letter: word[i],
        };
      }
    });
    
    setGrid(emptyGrid);
    setUserAnswers({});
    setSelectedCell(null);
    setDirection('across');
    setHints(3);
    setIsComplete(false);
  };
  
  // Get number label for word (for display purposes)
  const getWordNumber = (wordIndex, words) => {
    // Sort words by position and assign numbers sequentially
    const sortedWords = [...words].sort((a, b) => {
      if (a.row !== b.row) {
        return a.row - b.row;
      }
      return a.col - b.col;
    });
    
    return sortedWords.findIndex(w => w === words[wordIndex]) + 1;
  };
  
  // Handle cell selection
  const handleCellClick = (rowIndex, colIndex) => {
    if (!grid[rowIndex][colIndex]?.isActive) return;
    
    if (selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex) {
      // Toggle direction if clicking the same cell
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      // Select cell and determine best direction
      setSelectedCell({ row: rowIndex, col: colIndex });
      
      // If the cell is part of both an across and down word, choose one
      const cell = grid[rowIndex][colIndex];
      if (cell.wordIds.length > 1) {
        // Check both directions and choose based on current user preference
        const wordAcross = puzzle.words.find((word, idx) => 
          cell.wordIds.includes(idx) && word.direction === 'across'
        );
        
        const wordDown = puzzle.words.find((word, idx) => 
          cell.wordIds.includes(idx) && word.direction === 'down'
        );
        
        if (wordAcross && wordDown) {
          // Keep current direction if possible, otherwise toggle
          const hasCurrentDirection = direction === 'across' ? wordAcross : wordDown;
          if (!hasCurrentDirection) {
            setDirection(prev => prev === 'across' ? 'down' : 'across');
          }
        } else if (wordAcross) {
          setDirection('across');
        } else if (wordDown) {
          setDirection('down');
        }
      } else {
        // Find the word this cell belongs to and set appropriate direction
        const wordId = cell.wordIds[0];
        setDirection(puzzle.words[wordId].direction);
      }
    }
  };
  
  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    if (e.key === 'Backspace' || e.key === 'Delete') {
      handleLetterInput('');
      moveSelection(-1);
    } else if (e.key === 'ArrowLeft') {
      moveSelectionHorizontal(-1);
    } else if (e.key === 'ArrowRight') {
      moveSelectionHorizontal(1);
    } else if (e.key === 'ArrowUp') {
      moveSelectionVertical(-1);
    } else if (e.key === 'ArrowDown') {
      moveSelectionVertical(1);
    } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/i)) {
      handleLetterInput(e.key.toUpperCase());
      moveSelection(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      jumpToNextWord();
    }
  };
  
  // Handle letter input
  const handleLetterInput = (letter) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    // Update user answers
    setUserAnswers(prev => ({
      ...prev,
      [`${row}-${col}`]: letter
    }));
  };
  
  // Move selection based on current direction
  const moveSelection = (step) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    if (direction === 'across') {
      moveSelectionHorizontal(step);
    } else {
      moveSelectionVertical(step);
    }
  };
  
  // Move selection horizontally
  const moveSelectionHorizontal = (step) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    let newCol = col + step;
    
    // Find next active cell or stay at current position
    while (newCol >= 0 && newCol < puzzle.gridSize) {
      if (grid[row][newCol]?.isActive) {
        setSelectedCell({ row, col: newCol });
        return;
      }
      newCol += step;
    }
  };
  
  // Move selection vertically
  const moveSelectionVertical = (step) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    let newRow = row + step;
    
    // Find next active cell or stay at current position
    while (newRow >= 0 && newRow < puzzle.gridSize) {
      if (grid[newRow][col]?.isActive) {
        setSelectedCell({ row: newRow, col });
        return;
      }
      newRow += step;
    }
  };
  
  // Jump to next word
  const jumpToNextWord = () => {
    if (!puzzle) return;
    
    // Find the index of the current word
    let currentWordIndex = -1;
    
    if (selectedCell) {
      const { row, col } = selectedCell;
      const cell = grid[row][col];
      
      if (cell && cell.wordIds) {
        // Find the word in the current direction
        const currentWord = puzzle.words.findIndex((word, idx) => 
          cell.wordIds.includes(idx) && word.direction === direction
        );
        
        if (currentWord !== -1) {
          currentWordIndex = currentWord;
        }
      }
    }
    
    // Find the next word index
    const nextWordIndex = (currentWordIndex + 1) % puzzle.words.length;
    const nextWord = puzzle.words[nextWordIndex];
    
    // Select the first cell of the next word
    setSelectedCell({ row: nextWord.row, col: nextWord.col });
    setDirection(nextWord.direction);
  };
  
  // Use a hint to fill in a letter
  const useHint = () => {
    if (hints <= 0 || !selectedCell) return;
    
    const { row, col } = selectedCell;
    const cell = grid[row][col];
    
    // Fill in the correct letter
    setUserAnswers(prev => ({
      ...prev,
      [`${row}-${col}`]: cell.letter
    }));
    
    // Decrement hints
    setHints(prev => prev - 1);
    
    // Show notification
    setNotification({
      open: true,
      message: `Hint used! ${hints - 1} hints remaining.`,
      severity: 'info'
    });
  };
  
  // Request hint for current word
  const requestWordHint = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const cell = grid[row][col];
    
    // Find the word in the current direction
    const wordId = puzzle.words.findIndex((word, idx) => 
      cell.wordIds.includes(idx) && word.direction === direction
    );
    
    if (wordId !== -1) {
      setCurrentHintWord(puzzle.words[wordId]);
      setShowHintDialog(true);
    }
  };
  
  // Check if puzzle is complete
  useEffect(() => {
    if (!grid.length || !puzzle) return;
    
    // Check each active cell
    let isAllCorrect = true;
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];
        
        if (cell?.isActive) {
          const userLetter = userAnswers[`${row}-${col}`] || '';
          
          if (userLetter !== cell.letter) {
            isAllCorrect = false;
            break;
          }
        }
      }
      
      if (!isAllCorrect) break;
    }
    
    setIsComplete(isAllCorrect);
  }, [userAnswers, grid, puzzle]);
  
  // Render difficulty selection
  if (!difficulty) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Petrochemical Crossword Puzzle
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ mb: 4 }}>
          Test your knowledge of petrochemical terminology with these themed crossword puzzles.
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' },
                borderTop: '4px solid #4caf50'
              }}
              onClick={() => initializePuzzle('beginner')}
            >
              <Typography variant="h6" gutterBottom>Beginner</Typography>
              <Typography variant="body2" color="textSecondary">
                Basic petrochemical concepts and terminology
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                7 words • 12×12 grid
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' },
                borderTop: '4px solid #2196f3'
              }}
              onClick={() => initializePuzzle('intermediate')}
            >
              <Typography variant="h6" gutterBottom>Intermediate</Typography>
              <Typography variant="body2" color="textSecondary">
                Advanced refining processes and chemical concepts
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                7 words • 15×15 grid
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
  
  // Render puzzle completion screen
  if (isComplete) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <EmojiEventsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Puzzle Completed!
          </Typography>
          <Typography variant="body1" paragraph>
            Great job! You've successfully completed the {difficulty} petrochemical crossword puzzle.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => initializePuzzle(difficulty)}
            >
              Play Again
            </Button>
            <Button 
              variant="outlined"
              onClick={() => setDifficulty(null)}
            >
              Change Difficulty
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  // Render crossword puzzle
  return (
    <Box
      sx={{
        maxWidth: difficulty === 'intermediate' ? 900 : 800,
        mx: 'auto',
        tabIndex: 0,
        outline: 'none',
      }}
      onKeyDown={handleKeyDown}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Crossword
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Hints remaining">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LightbulbIcon color="action" sx={{ mr: 0.5 }} />
              <Typography>{hints}</Typography>
            </Box>
          </Tooltip>
          
          <Button 
            variant="outlined" 
            size="small"
            onClick={useHint}
            disabled={hints <= 0 || !selectedCell}
          >
            Use Hint
          </Button>
          
          <Button 
            variant="outlined" 
            size="small"
            onClick={requestWordHint}
            disabled={!selectedCell}
          >
            Clue
          </Button>
          
          <Button 
            variant="text" 
            color="inherit" 
            size="small"
            onClick={() => setDifficulty(null)}
          >
            Change Puzzle
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={2}>
        {/* Crossword grid */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              aspectRatio: '1/1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: `repeat(${puzzle.gridSize}, 1fr)`,
                gridTemplateColumns: `repeat(${puzzle.gridSize}, 1fr)`,
                gap: 0.5,
                width: '100%',
                height: '100%',
              }}
            >
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <Box
                    key={`${rowIndex}-${colIndex}`}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      backgroundColor: !cell?.isActive ? '#1a1a1a' : 
                        (selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex) ? '#bbdefb' : 
                        (selectedCell && 
                          grid[selectedCell.row][selectedCell.col]?.wordIds?.some(id => 
                            cell?.wordIds?.includes(id) && puzzle.words[id].direction === direction
                          )
                        ) ? '#e3f2fd' : 
                        'white',
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: cell?.isActive ? 'pointer' : 'default',
                      fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell?.isActive && (
                      <>
                        {cell.number && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              fontSize: '0.6rem',
                              padding: '1px',
                            }}
                          >
                            {cell.number}
                          </Box>
                        )}
                        
                        {userAnswers[`${rowIndex}-${colIndex}`] || ''}
                      </>
                    )}
                  </Box>
                ))
              ))}
            </Box>
          </Paper>
        </Grid>
        
        {/* Clues */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>Across</Typography>
            {puzzle.words
              .filter(word => word.direction === 'across')
              .sort((a, b) => 
                getWordNumber(puzzle.words.indexOf(a), puzzle.words) - 
                getWordNumber(puzzle.words.indexOf(b), puzzle.words)
              )
              .map((word, index) => (
                <Box 
                  key={`across-${index}`}
                  sx={{ 
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: 
                      selectedCell && 
                      grid[selectedCell.row][selectedCell.col]?.wordIds?.includes(puzzle.words.indexOf(word)) && 
                      direction === 'across' ? 
                        '#e3f2fd' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedCell({ row: word.row, col: word.col });
                    setDirection('across');
                  }}
                >
                  <Typography variant="body2">
                    <strong>{getWordNumber(puzzle.words.indexOf(word), puzzle.words)}.</strong> {word.clue}
                  </Typography>
                </Box>
              ))}
              
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>Down</Typography>
            {puzzle.words
              .filter(word => word.direction === 'down')
              .sort((a, b) => 
                getWordNumber(puzzle.words.indexOf(a), puzzle.words) - 
                getWordNumber(puzzle.words.indexOf(b), puzzle.words)
              )
              .map((word, index) => (
                <Box 
                  key={`down-${index}`}
                  sx={{ 
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: 
                      selectedCell && 
                      grid[selectedCell.row][selectedCell.col]?.wordIds?.includes(puzzle.words.indexOf(word)) && 
                      direction === 'down' ? 
                        '#e3f2fd' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedCell({ row: word.row, col: word.col });
                    setDirection('down');
                  }}
                >
                  <Typography variant="body2">
                    <strong>{getWordNumber(puzzle.words.indexOf(word), puzzle.words)}.</strong> {word.clue}
                  </Typography>
                </Box>
              ))}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Hint dialog */}
      <Dialog
        open={showHintDialog}
        onClose={() => setShowHintDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Clue for {currentHintWord?.direction.charAt(0).toUpperCase() + currentHintWord?.direction.slice(1)} {currentHintWord && getWordNumber(puzzle.words.indexOf(currentHintWord), puzzle.words)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentHintWord?.clue}
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontWeight: 'bold' }}>
            The answer has {currentHintWord?.word.length} letters.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHintDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ChemistryCrossword;
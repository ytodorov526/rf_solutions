import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Game data with petrochemical molecules and their properties/uses
const moleculeData = [
  {
    id: 1,
    name: "Ethylene (C₂H₄)",
    description: "The most produced organic compound, used to make polyethylene, ethylene oxide, and many other chemicals",
    category: "Olefin",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Ethylene-2D-flat.svg/240px-Ethylene-2D-flat.svg.png"
  },
  {
    id: 2,
    name: "Propylene (C₃H₆)",
    description: "Used to produce polypropylene, acrylonitrile, propylene oxide, and isopropanol",
    category: "Olefin",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Propene-2D-flat.svg/240px-Propene-2D-flat.svg.png"
  },
  {
    id: 3,
    name: "Benzene (C₆H₆)",
    description: "Precursor to styrene, phenol, cyclohexane, and many other aromatic compounds",
    category: "Aromatic",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Benzene-2D-flat.svg/240px-Benzene-2D-flat.svg.png"
  },
  {
    id: 4,
    name: "Butadiene (C₄H₆)",
    description: "Used to make synthetic rubber for tires and other rubber products",
    category: "Diene",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Buta-1%2C3-diene-2D-flat.svg/240px-Buta-1%2C3-diene-2D-flat.svg.png"
  },
  {
    id: 5,
    name: "Toluene (C₇H₈)",
    description: "Used as a solvent and in the production of benzene, xylenes, and TNT",
    category: "Aromatic",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Toluene-2D-flat.svg/240px-Toluene-2D-flat.svg.png"
  },
  {
    id: 6,
    name: "Methanol (CH₃OH)",
    description: "Used to produce formaldehyde, acetic acid, and MTBE, and as a fuel additive",
    category: "Alcohol",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Methanol-2D.svg/240px-Methanol-2D.svg.png"
  },
  {
    id: 7,
    name: "Ethylene Oxide (C₂H₄O)",
    description: "Used to make ethylene glycol for antifreeze and polyester fibers",
    category: "Epoxide",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Ethylene-oxide-2D.svg/240px-Ethylene-oxide-2D.svg.png"
  },
  {
    id: 8,
    name: "Xylene (C₈H₁₀)",
    description: "Used in the production of polyethylene terephthalate (PET) for plastic bottles",
    category: "Aromatic",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/P-xylene.svg/240px-P-xylene.svg.png"
  },
  {
    id: 9,
    name: "Ethylene Glycol (C₂H₆O₂)",
    description: "Used as antifreeze and to make polyester fibers and resins",
    category: "Diol",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ethylene-glycol-2D-skeletal.svg/240px-Ethylene-glycol-2D-skeletal.svg.png"
  },
  {
    id: 10,
    name: "Acetic Acid (C₂H₄O₂)",
    description: "Used to produce vinyl acetate monomer, acetic anhydride, and as a solvent",
    category: "Carboxylic Acid",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Acetic-acid-2D-flat.svg/240px-Acetic-acid-2D-flat.svg.png"
  },
  {
    id: 11,
    name: "Acrylonitrile (C₃H₃N)",
    description: "Used to make acrylic fibers, ABS plastics, and nitrile rubber",
    category: "Nitrile",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Acrylonitrile-2D-flat.png/240px-Acrylonitrile-2D-flat.png"
  },
  {
    id: 12,
    name: "Styrene (C₈H₈)",
    description: "Used to produce polystyrene, ABS, and SBR rubber",
    category: "Aromatic",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Styrene_chemical_structure.svg/240px-Styrene_chemical_structure.svg.png"
  }
];

function MolecularMatchingGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(null);
  
  // Set up game based on difficulty level
  const setupGame = (difficulty) => {
    setDifficultyLevel(difficulty);
    
    // Choose number of pairs based on difficulty
    let numPairs;
    let gameTime;
    
    switch(difficulty) {
      case 'easy':
        numPairs = 4;
        gameTime = 120;
        break;
      case 'medium':
        numPairs = 6;
        gameTime = 120;
        break;
      case 'hard':
        numPairs = 8;
        gameTime = 180;
        break;
      default:
        numPairs = 4;
        gameTime = 120;
    }
    
    // Shuffle and select molecules
    const shuffledMolecules = [...moleculeData].sort(() => 0.5 - Math.random()).slice(0, numPairs);
    
    // Create pairs of cards (molecule and description)
    const gamePairs = [];
    shuffledMolecules.forEach(molecule => {
      // Card with molecule name and image
      gamePairs.push({
        id: `${molecule.id}-name`,
        type: 'name',
        content: molecule.name,
        imageUrl: molecule.imageUrl,
        matchId: molecule.id
      });
      
      // Card with molecule description
      gamePairs.push({
        id: `${molecule.id}-desc`,
        type: 'description',
        content: molecule.description,
        matchId: molecule.id
      });
    });
    
    // Shuffle pairs
    const shuffledPairs = [...gamePairs].sort(() => 0.5 - Math.random());
    
    setCards(shuffledPairs);
    setTimeLeft(gameTime);
    setScore(0);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setGameStarted(true);
    setGameCompleted(false);
  };
  
  // Start timer when game starts
  useEffect(() => {
    let timer;
    
    if (gameStarted && !gameCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameCompleted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [gameStarted, gameCompleted]);
  
  // Check if all pairs are matched
  useEffect(() => {
    if (gameStarted && matchedPairs.length === cards.length / 2) {
      setGameCompleted(true);
    }
  }, [matchedPairs, cards.length, gameStarted]);
  
  // Handle card flip
  const handleCardFlip = (index) => {
    // Prevent flipping if already checking a match or card is already flipped or matched
    if (
      isCheckingMatch || 
      flippedIndices.includes(index) || 
      matchedPairs.includes(cards[index].matchId)
    ) {
      return;
    }
    
    // Flip the card
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // If this is the second card flipped, check for a match
    if (newFlippedIndices.length === 2) {
      setIsCheckingMatch(true);
      
      const firstCardIndex = newFlippedIndices[0];
      const secondCardIndex = newFlippedIndices[1];
      
      if (cards[firstCardIndex].matchId === cards[secondCardIndex].matchId) {
        // Match found
        setScore(prevScore => prevScore + 10);
        setMatchedPairs(prevMatched => [...prevMatched, cards[firstCardIndex].matchId]);
        setFlippedIndices([]);
        setIsCheckingMatch(false);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
          setIsCheckingMatch(false);
        }, 1000);
      }
    }
  };
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate final score based on time left and matched pairs
  const calculateFinalScore = () => {
    const baseScore = matchedPairs.length * 10;
    const timeBonus = timeLeft > 0 ? Math.floor(timeLeft / 10) : 0;
    return baseScore + timeBonus;
  };
  
  // Restart the game
  const handleRestartGame = () => {
    setupGame(difficultyLevel);
  };
  
  // Change difficulty
  const handleChangeDifficulty = () => {
    setGameStarted(false);
    setDifficultyLevel(null);
  };
  
  // Render difficulty selection screen
  if (!gameStarted) {
    return (
      <Box>
        <Typography variant="h5" align="center" gutterBottom>
          Molecular Matching Challenge
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ mb: 4 }}>
          Match petrochemical molecules with their descriptions and uses in this memory game.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ maxWidth: 700, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Select Difficulty Level:
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                    borderTop: '4px solid #4caf50'
                  }}
                  onClick={() => setupGame('easy')}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Easy</Typography>
                    <Typography variant="body2" color="textSecondary">
                      4 molecule pairs (8 cards)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      2 minutes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                    borderTop: '4px solid #2196f3'
                  }}
                  onClick={() => setupGame('medium')}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Medium</Typography>
                    <Typography variant="body2" color="textSecondary">
                      6 molecule pairs (12 cards)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      2 minutes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                    borderTop: '4px solid #f44336'
                  }}
                  onClick={() => setupGame('hard')}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Hard</Typography>
                    <Typography variant="body2" color="textSecondary">
                      8 molecule pairs (16 cards)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      3 minutes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
  
  // Render game completion screen
  if (gameCompleted) {
    const finalScore = calculateFinalScore();
    const allMatched = matchedPairs.length === cards.length / 2;
    
    return (
      <Box>
        <Paper elevation={3} sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <EmojiEventsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Game Over!
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Final Score: {finalScore} points
            </Typography>
            
            <Alert 
              severity={allMatched ? "success" : "info"} 
              sx={{ mt: 2, mb: 3 }}
            >
              {allMatched 
                ? `Congratulations! You matched all ${matchedPairs.length} pairs with ${formatTime(timeLeft)} remaining.` 
                : `You matched ${matchedPairs.length} out of ${cards.length / 2} pairs.`
              }
            </Alert>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleRestartGame}
              >
                Play Again
              </Button>
              <Button 
                variant="outlined"
                onClick={handleChangeDifficulty}
              >
                Change Difficulty
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  // Render game board
  return (
    <Box>
      <Paper elevation={3} sx={{ maxWidth: '100%', mx: 'auto', p: 4, borderRadius: 2 }}>
        {/* Game header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Score: {score}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimerIcon color="action" sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              color={timeLeft < 30 ? "error" : "textPrimary"}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Game cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          {cards.map((card, index) => (
            <Box
              key={card.id}
              onClick={() => handleCardFlip(index)}
              sx={{
                width: { xs: '45%', sm: '30%', md: difficultyLevel === 'hard' ? '22%' : '30%' },
                aspectRatio: '1',
                perspective: '1000px',
                cursor: 
                  matchedPairs.includes(card.matchId) || flippedIndices.includes(index)
                    ? 'default'
                    : 'pointer',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  transform: flippedIndices.includes(index) || matchedPairs.includes(card.matchId)
                    ? 'rotateY(180deg)'
                    : 'rotateY(0deg)',
                }}
              >
                {/* Card back */}
                <Paper
                  elevation={2}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#1976d2',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    ?
                  </Typography>
                </Paper>
                
                {/* Card front */}
                <Paper
                  elevation={2}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1,
                    backgroundColor: matchedPairs.includes(card.matchId) ? '#e8f5e9' : 'white',
                    borderRadius: 2,
                    border: matchedPairs.includes(card.matchId) ? '2px solid #4caf50' : 'none',
                    overflow: 'hidden',
                  }}
                >
                  {card.type === 'name' && (
                    <>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                        {card.content}
                      </Typography>
                      {card.imageUrl && (
                        <Box
                          component="img"
                          src={card.imageUrl}
                          alt={card.content}
                          sx={{ maxWidth: '80%', maxHeight: '60%', objectFit: 'contain' }}
                        />
                      )}
                    </>
                  )}
                  
                  {card.type === 'description' && (
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', textAlign: 'center' }}>
                      {card.content}
                    </Typography>
                  )}
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

export default MolecularMatchingGame;
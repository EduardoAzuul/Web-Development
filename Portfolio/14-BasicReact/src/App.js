import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function MovieGallery() {
  // State to store the movie data
  const [movies, setMovies] = useState([]);
  // State to track if data is still loading
  const [loading, setLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState(null);
  // State to store the currently selected character to display
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  // State to track which card is being hovered (stores the index)
  const [hoveredCard, setHoveredCard] = useState(null);
  // State to track likes and dislikes for each movie (index-based)
  const [movieRatings, setMovieRatings] = useState({});
  // State to store comments for each character (keyed by character name)
  const [comments, setComments] = useState({});
  // State for the comment form inputs
  const [commentForm, setCommentForm] = useState({ name: '', comment: '' });

  // useEffect runs once when component mounts to load the data
  useEffect(() => {
    console.log('Component mounted, attempting to load data...');
    
    // Fetch the data.js file from the public folder
    fetch('/data/data.js')
      .then(response => {
        console.log('Fetch response status:', response.status);
        console.log('Fetch response ok:', response.ok);
        return response.text();
      })
      .then(text => {
        console.log('Raw file content loaded');
        
        // Use regex to extract the sw array from the file
        const swMatch = text.match(/const\s+sw\s*=\s*(\[[\s\S]*\]);/);
        console.log('Regex match found:', swMatch ? 'YES' : 'NO');
        
        if (swMatch) {
          // Extract the array string and parse it into JavaScript object
          const jsonStr = swMatch[1];
          const parsedData = eval('(' + jsonStr + ')');
          console.log('Parsed data:', parsedData);
          console.log('Number of movies:', parsedData.length);
          
          // Update state with the parsed movie data
          setMovies(parsedData);
          
          // Initialize ratings for each movie (all start at 0 likes, 0 dislikes)
          const initialRatings = {};
          parsedData.forEach((movie, index) => {
            initialRatings[index] = { likes: 0, dislikes: 0 };
          });
          setMovieRatings(initialRatings);
        } else {
          console.error('Could not find sw array in file');
          setError('Could not parse data file');
        }
        // Set loading to false since we're done loading
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs only once

  // Function to handle when "More..." button is clicked
  const handleMoreClick = (character) => {
    console.log('More button clicked for:', character.name);
    // Set the selected character to display their details
    setSelectedCharacter(character);
    // Scroll smoothly to the character section after a brief delay
    setTimeout(() => {
      document.getElementById('character-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  // Function to handle like button click
  const handleLike = (index) => {
    setMovieRatings(prevRatings => ({
      ...prevRatings,
      [index]: {
        ...prevRatings[index],
        likes: prevRatings[index].likes + 1
      }
    }));
    console.log(`Movie ${index} liked! New count:`, movieRatings[index].likes + 1);
  };

  // Function to handle dislike button click
  const handleDislike = (index) => {
    setMovieRatings(prevRatings => ({
      ...prevRatings,
      [index]: {
        ...prevRatings[index],
        dislikes: prevRatings[index].dislikes + 1
      }
    }));
    console.log(`Movie ${index} disliked! New count:`, movieRatings[index].dislikes + 1);
  };

  // Function to calculate overall appreciation percentage
  const getAppreciationPercentage = (index) => {
    const rating = movieRatings[index];
    if (!rating) return 0;
    
    const total = rating.likes + rating.dislikes;
    if (total === 0) return 0;
    
    return Math.round((rating.likes / total) * 100);
  };

  // Function to handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!commentForm.name.trim() || !commentForm.comment.trim()) {
      alert('Please fill in both name and comment fields');
      return;
    }
    
    // Get the character name as the key
    const characterKey = selectedCharacter.name;
    
    // Add the new comment to the comments state
    setComments(prevComments => ({
      ...prevComments,
      [characterKey]: [
        ...(prevComments[characterKey] || []),
        {
          name: commentForm.name.trim(),
          comment: commentForm.comment.trim(),
          timestamp: new Date().toISOString()
        }
      ]
    }));
    
    // Clear the form
    setCommentForm({ name: '', comment: '' });
    
    console.log('Comment added for:', characterKey);
  };

  // Function to determine if an affiliation is good or evil
  const getAffiliationColor = (affiliation) => {
    const goodAffiliations = ['jedi', 'rebellion'];
    const evilAffiliations = ['sith', 'empire'];
    
    const affiliationLower = affiliation.toLowerCase();
    
    if (goodAffiliations.includes(affiliationLower)) {
      return 'blue';
    } else if (evilAffiliations.includes(affiliationLower)) {
      return 'red';
    }
    return 'gray'; // Default color for unknown affiliations
  };

  // Show loading message while data is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="text-white fs-4">Loading movies...</div>
      </div>
    );
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="text-danger fs-4">Error: {error}</div>
        <div className="text-white mt-3">Check the browser console (F12) for details</div>
      </div>
    );
  }

  // Show message if no movies were found
  if (movies.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="text-warning fs-4">No movies found. Check console for details.</div>
      </div>
    );
  }

  // Main render: display the movie gallery
  return (
    <div className="movie-gallery min-vh-100 py-5">
      <div className="container">
        {/* Page Title */}
        <h1 className="text-center text-white mb-5 display-3 fw-bold">
          Star Wars Collection
        </h1>
        
        {/* Movie Cards Grid */}
        <div className="row g-4 mb-5">
          {/* Map through each movie and create a card */}
          {movies.map((movie, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div 
                className="card movie-card h-100 bg-dark text-white position-relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Container with overlay */}
                <div className="position-relative movie-image-container">
                  {/* Movie Poster Image */}
                  <img 
                    src={`/images/${movie.poster}`}
                    alt={movie.title}
                    className="card-img-top movie-poster"
                    style={{ opacity: hoveredCard === index ? 0.3 : 1 }}
                    onError={(e) => {
                      console.error('Image failed to load:', movie.poster);
                      // Show placeholder if image fails to load
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                  
                  {/* Affiliation Overlay - shows when hovering */}
                  {hoveredCard === index && (
                    <div 
                      className="affiliation-overlay d-flex flex-column align-items-center justify-content-center"
                      style={{ 
                        backgroundColor: getAffiliationColor(movie.best_character.affiliation) 
                      }}
                    >
                      {/* Character Image */}
                      <img 
                        src={`/images/${movie.best_character.image}`}
                        alt={movie.best_character.affiliation}
                        className="affiliation-logo mb-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {/* Affiliation Text */}
                      <h3 className="text-white fw-bold text-uppercase affiliation-text">
                        {movie.best_character.affiliation}
                      </h3>
                    </div>
                  )}
                </div>
                
                {/* Card Body with Movie Info */}
                <div className="card-body d-flex flex-column">
                  {/* Movie Title */}
                  <h5 className="card-title fs-4 fw-bold">{movie.title}</h5>
                  {/* Movie Year */}
                  <p className="card-text text-info fs-5 mb-3">{movie.year}</p>
                  
                  {/* Like/Dislike Section */}
                  <div className="rating-section mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      {/* Like Button */}
                      <button 
                        className="btn btn-success btn-sm d-flex align-items-center gap-2"
                        onClick={() => handleLike(index)}
                      >
                        <span>Like :)</span>
                        <span className="fw-bold">{movieRatings[index]?.likes || 0}</span>
                      </button>
                      
                      {/* Appreciation Percentage */}
                      <div className="text-warning fw-bold">
                        {getAppreciationPercentage(index)}% 
                      </div>
                      
                      {/* Dislike Button */}
                      <button 
                        className="btn btn-danger btn-sm d-flex align-items-center gap-2"
                        onClick={() => handleDislike(index)}
                      >
                        <span className="fw-bold">{movieRatings[index]?.dislikes || 0}</span>
                        <span>👎</span>
                      </button>
                    </div>
                    
                    {/* Progress Bar showing appreciation */}
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success"
                        style={{ width: `${getAppreciationPercentage(index)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* More Button - pushes to bottom with mt-auto */}
                  <button 
                    className="btn btn-primary mt-auto w-100"
                    onClick={() => handleMoreClick(movie.best_character)}
                  >
                    More info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Character Detail Section - only shows when a character is selected */}
        {selectedCharacter && (
          <div id="character-section" className="character-detail mt-5 p-4 bg-dark border border-info rounded">
            <h2 className="text-center text-white mb-4 display-5">Main Character</h2>
            <div className="row align-items-center">
              {/* Character Image Column */}
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <img 
                  src={`/images/${selectedCharacter.image}`}
                  alt={selectedCharacter.name}
                  className="img-fluid rounded character-image"
                  onError={(e) => {
                    console.error('Character image failed to load:', selectedCharacter.image);
                    // Show placeholder if character image fails to load
                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
              </div>
              {/* Character Info Column */}
              <div className="col-md-8">
                {/* Character Name */}
                <h3 className="text-white fw-bold mb-3">{selectedCharacter.name}</h3>
                {/* Character Affiliation Badge */}
                <p className="badge bg-info text-dark fs-6 mb-3">{selectedCharacter.affiliation}</p>
                {/* Character Biography */}
                <p className="text-white-50 fs-6 lh-base">{selectedCharacter.bio}</p>
                {/* Close Button to hide character details */}
                <button 
                  className="btn btn-outline-secondary mt-3"
                  onClick={() => setSelectedCharacter(null)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-5">
              <h3 className="text-white mb-4">Comments</h3>
              
              {/* Comment Form */}
              <div className="card bg-secondary bg-opacity-25 p-4 mb-4">
                <h5 className="text-white mb-3">Add a Comment</h5>
                <form onSubmit={handleCommentSubmit}>
                  <div className="mb-3">
                    <label htmlFor="commentName" className="form-label text-white">Name</label>
                    <input 
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      id="commentName"
                      placeholder="Enter your name"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="commentText" className="form-label text-white">Comment</label>
                    <textarea 
                      className="form-control bg-dark text-white border-secondary"
                      id="commentText"
                      rows="3"
                      placeholder="Share your thoughts..."
                      value={commentForm.comment}
                      onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit Comment
                  </button>
                </form>
              </div>

              {/* Display Comments */}
              <div className="comments-list">
                {comments[selectedCharacter.name] && comments[selectedCharacter.name].length > 0 ? (
                  comments[selectedCharacter.name].map((comment, index) => (
                    <div key={index} className="card bg-secondary bg-opacity-10 p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="text-info mb-0">{comment.name}</h6>
                        <small className="text-white-50">
                          {new Date(comment.timestamp).toLocaleString()}
                        </small>
                      </div>
                      <p className="text-white mb-0">{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white-50 text-center">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// Array of people data
const people = [
    {
        name: "Albert Einstein",
        birth: "14 March 1879",
        death: "18 April 1955",
        profession: "Physicist",
        achievements: "Theory of Relativity, Nobel Prize in Physics (1921)",
        image: "images/einstein.jpg"
    },
    {
        name: "Frida Kahlo",
        birth: "6 July 1907",
        death: "13 July 1954",
        profession: "Painter",
        achievements: "Iconic self-portraits, Surrealist art",
        image: "images/frida.jpg"
    },
    {
        name: "Nikola Tesla",
        birth: "10 July 1856",
        death: "7 January 1943",
        profession: "Inventor",
        achievements: "AC current, Tesla coil, radio technology",
        image: "images/tesla.jpg"
    },
    {
        name: "Marie Curie",
        birth: "7 November 1867",
        death: "4 July 1934",
        profession: "Scientist",
        achievements: "First woman to win Nobel Prize, discovered radium and polonium",
        image: "images/curie.jpg"
    },
    {
        name: "Leonardo da Vinci",
        birth: "15 April 1452",
        death: "2 May 1519",
        profession: "Artist, Inventor",
        achievements: "Mona Lisa, The Last Supper, Flying machine designs",
        image: "images/leonardo.jpg"
    },
    {
        name: "Nelson Mandela",
        birth: "18 July 1918",
        death: "5 December 2013",
        profession: "Political Leader",
        achievements: "Anti-apartheid revolutionary, Nobel Peace Prize (1993)",
        image: "images/mandela.jpg"
    }
];

// Pagination variables
let currentPage = 0;
const cardsPerPage = 3;
let isInitialized = false;

// Function to create a single card element
function createCard(person) {
    const card = document.createElement("div");
    card.classList.add("card");
    
    card.innerHTML = `
        <img src="${person.image}" alt="${person.name}" class="card-image" 
             onerror="this.src='images/placeholder.jpg'; this.alt='Image not found';">
        <div class="card-content">
            <h2 class="card-name">${person.name}</h2>
            <p><strong>Date of Birth:</strong> ${person.birth}</p>
            ${person.death ? `<p><strong>Date of Death:</strong> ${person.death}</p>` : '<p><strong>Status:</strong> Living</p>'}
            <p><strong>Profession:</strong> ${person.profession}</p>
            <p><strong>Achievements:</strong> ${person.achievements}</p>
        </div>
    `;
    
    return card;
}

// Function to render current page of cards
function renderCurrentPage() {
    const container = document.getElementById("cards-container");
    
    if (!container) {
        return;
    }
    
    // Clear existing cards
    container.innerHTML = '';
    
    // Calculate start and end indices
    const startIndex = currentPage * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, people.length);
    
    // Get current page people
    const currentPeople = people.slice(startIndex, endIndex);
    
    // Create and append cards
    currentPeople.forEach(person => {
        const card = createCard(person);
        container.appendChild(card);
    });
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Function to update navigation button states
function updateNavigationButtons() {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageIndicator = document.getElementById("page-indicator");
    
    if (!prevBtn || !nextBtn) return;
    
    const totalPages = Math.ceil(people.length / cardsPerPage);
    
    // Update button states
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages - 1;
    
    // Update page indicator if it exists
    if (pageIndicator) {
        pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
    }
}

// Function to go to next page
function goToNextPage() {
    const totalPages = Math.ceil(people.length / cardsPerPage);
    if (currentPage < totalPages - 1) {
        currentPage++;
        renderCurrentPage();
    }
}

// Function to go to previous page
function goToPreviousPage() {
    if (currentPage > 0) {
        currentPage--;
        renderCurrentPage();
    }
}

// Initialize everything once when DOM is ready
function initializeCards() {
    if (isInitialized) return;
    
    // Render initial page
    renderCurrentPage();
    
    // Attach event listeners to buttons - only once
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', goToPreviousPage);
        nextBtn.addEventListener('click', goToNextPage);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            goToPreviousPage();
        } else if (event.key === 'ArrowRight') {
            goToNextPage();
        }
    });
    
    isInitialized = true;
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCards);
} else {
    initializeCards();
}
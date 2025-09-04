// Array of people data
const people = [
    {
        name: "Leonardo da Vinci",
        birth: "15 April 1452",
        death: "2 May 1519",
        profession: "Artist, Inventor",
        achievements: "Mona Lisa, The Last Supper, Flying machine designs",
        image: "PeoplePortraits/leonardo.jpg"
    },
    {
        name: "George Orwell",
        birth: "25 June 1903",
        death: "21 January 1950",
        profession: "Writer, Journalist",
        achievements: "1984, Animal Farm, Essays on politics and society",
        image: "PeoplePortraits/orwell.jpg"
    },
    {
        name: "Rusowsky",
        birth: "28 October 1996",
        death: null,
        profession: "Musician, Producer",
        achievements: "Known for bedroom pop and indie electronic music in Spain",
        image: "PeoplePortraits/rusowsky.jpg"
    },
    {
        name: "NSQK",
        birth: "22 December 1996",
        death: null,
        profession: "Musician, Songwriter",
        achievements: "Mexican artist blending pop, R&B and electronic influences",
        image: "PeoplePortraits/nsqk.jpg"
    },
    {
        name: "Guillermo del Toro",
        birth: "9 October 1964",
        death: null,
        profession: "Film Director, Producer, Screenwriter",
        achievements: "Pan’s Labyrinth, The Shape of Water (Academy Award winner), Pacific Rim",
        image: "PeoplePortraits/gillermo.webp"
    },
    {
        name: "Penta El Zero Miedo",
        birth: "5 February 1985",
        death: null,
        profession: "Professional Wrestler",
        achievements: "AAA, AEW titles; joined WWE with brother Rey Fénix in 2024",
        image: "PeoplePortraits/penta.webp"
    },
    {
        name: "Rey Fénix",
        birth: "30 December 1990",
        death: null,
        profession: "Professional Wrestler",
        achievements: "AAA, AEW champion; joined WWE with Penta El Zero Miedo in 2024",
        image: "PeoplePortraits/reyFenix.webp"
    },
    {
        name: "El Hijo del Vikingo",
        birth: "29 April 1997",
        death: null,
        profession: "Professional Wrestler",
        achievements: "AAA Mega Champion, internationally acclaimed luchador with innovative aerial style",
        image: "PeoplePortraits/vikingo.png"
    },
    {
        name: "Psycho Clown",
        birth: "16 December 1985",
        death: null,
        profession: "Professional Wrestler",
        achievements: "AAA main star, multiple championships, iconic mask, part of Los Psycho Circus",
        image: "PeoplePortraits/psycho.webp"
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
             ; this.alt='Image not found';">
             
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
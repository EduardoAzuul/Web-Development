document.querySelector('.calendar-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const timeStart = document.getElementById('timeStart').value;
    const timeEnd = document.getElementById('timeEnd').value;
    const activity = document.getElementById('activity').value;
    const place = document.getElementById('place').value;
    const type = document.getElementById('type').value;
    const notes = document.getElementById('notes').value;
    const flag = document.getElementById('flag').value;
    const freeBusy = document.getElementById('freebusy').checked ? 'Busy' : 'Free';
    
    const message = `
    Appointment Details:

    Date: ${date}
    Time: ${timeStart} - ${timeEnd}
    Activity: ${activity}
    Place: ${place}
    Type: ${type}
    Notes: ${notes || 'None'}
    Flag Color: ${flag}
    Status: ${freeBusy}
        `;
        
    // Show alert
    alert(message);
    
    // Redirect to index
    window.location.href = 'index.html';
});



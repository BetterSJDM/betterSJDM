// Calendar Events Data for San Jose del Monte City
let calendarEvents = [];
let eventsData = null;

// Load events from JSON file
async function loadEvents() {
    try {
        const response = await fetch('../data/events.json');
        eventsData = await response.json();

        // Combine main events and barangay events
        calendarEvents = [
            ...eventsData.events.map(e => ({
                date: e.date,
                title: e.title,
                type: e.type,
                description: e.description,
                isMajorEvent: e.isMajorEvent || false
            })),
            ...eventsData.barangayEvents.map(e => ({
                date: e.date,
                title: e.title,
                type: e.type,
                description: e.description,
                isMajorEvent: false
            }))
        ];

        return true;
    } catch (error) {
        console.error('Error loading events:', error);
        // Fallback events if JSON fails to load
        calendarEvents = [
            { date: '2026-01-01', title: 'New Year\'s Day', type: 'holiday', description: 'National Holiday - New Year\'s Day celebration' },
            { date: '2026-01-10', title: 'State of the City Address', type: 'city', description: 'Annual State of the City Address by the Mayor', isMajorEvent: true },
        ];
        return false;
    }
}// Calendar State
let currentDate = new Date();
let currentView = 'calendar';
let activeFilters = ['all'];

// Initialize Calendar
document.addEventListener('DOMContentLoaded', async function() {
    await loadEvents();
    initializeCalendar();
    initializeEventListeners();
    updateCountdown();
    setInterval(updateCountdown, 1000); // Update countdown every second
});

function initializeCalendar() {
    renderCalendar();
    renderEventsList();
}

function initializeEventListeners() {
    // Month navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById('todayBtn').addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentView = e.target.dataset.view;
            toggleView();
        });
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;

            if (filter === 'all') {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                activeFilters = ['all'];
            } else {
                document.querySelector('[data-filter="all"]').classList.remove('active');
                e.target.classList.toggle('active');

                activeFilters = Array.from(document.querySelectorAll('.filter-btn.active'))
                    .map(b => b.dataset.filter)
                    .filter(f => f !== 'all');

                if (activeFilters.length === 0) {
                    document.querySelector('[data-filter="all"]').classList.add('active');
                    activeFilters = ['all'];
                }
            }

            if (currentView === 'calendar') {
                renderCalendar();
            } else {
                renderEventsList();
            }
        });
    });
}

function toggleView() {
    const calendarView = document.getElementById('calendarView');
    const listView = document.getElementById('listView');

    if (currentView === 'calendar') {
        calendarView.style.display = 'block';
        listView.style.display = 'none';
        renderCalendar();
    } else {
        calendarView.style.display = 'none';
        listView.style.display = 'block';
        renderEventsList();
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // Update month title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent =
        `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Previous month days
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayCell = createDayCell(prevMonthLastDay - i, true);
        grid.appendChild(dayCell);
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() &&
                       currentDate.getMonth() === today.getMonth() &&
                       currentDate.getFullYear() === today.getFullYear();
        const dayCell = createDayCell(day, false, isToday);
        grid.appendChild(dayCell);
    }

    // Next month days
    const remainingCells = 42 - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        const dayCell = createDayCell(day, true);
        grid.appendChild(dayCell);
    }
}

function createDayCell(day, isOtherMonth, isToday = false) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';

    if (isOtherMonth) {
        cell.classList.add('other-month');
    }
    if (isToday) {
        cell.classList.add('today');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    cell.appendChild(dayNumber);

    if (!isOtherMonth) {
        // Get events for this day
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = getEventsForDate(dateStr);

        if (dayEvents.length > 0) {
            cell.classList.add('has-events');
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';

            dayEvents.forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = `event-dot event-${event.type}`;
                eventDot.textContent = event.title;
                eventDot.title = event.description;
                eventsContainer.appendChild(eventDot);
            });

            cell.appendChild(eventsContainer);
        }
    }

    return cell;
}

function getEventsForDate(dateStr) {
    let events = calendarEvents.filter(event => event.date === dateStr);

    if (!activeFilters.includes('all')) {
        events = events.filter(event => activeFilters.includes(event.type));
    }

    return events;
}

function renderEventsList() {
    const list = document.getElementById('eventsList');
    list.innerHTML = '';

    // Get all events for current year
    let events = calendarEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === currentDate.getFullYear();
    });

    // Apply filters
    if (!activeFilters.includes('all')) {
        events = events.filter(event => activeFilters.includes(event.type));
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group by month
    const eventsByMonth = {};
    events.forEach(event => {
        const date = new Date(event.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (!eventsByMonth[monthKey]) {
            eventsByMonth[monthKey] = [];
        }
        eventsByMonth[monthKey].push(event);
    });

    // Render grouped events
    Object.keys(eventsByMonth).forEach(monthKey => {
        const [year, month] = monthKey.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];

        const monthHeader = document.createElement('h3');
        monthHeader.style.marginTop = '2rem';
        monthHeader.style.marginBottom = '1rem';
        monthHeader.textContent = `${monthNames[parseInt(month)]} ${year}`;
        list.appendChild(monthHeader);

        eventsByMonth[monthKey].forEach(event => {
            const card = createEventCard(event);
            list.appendChild(card);
        });
    });

    if (events.length === 0) {
        const noEvents = document.createElement('div');
        noEvents.style.textAlign = 'center';
        noEvents.style.padding = '3rem';
        noEvents.style.color = '#666';
        noEvents.innerHTML = '<i class="bi bi-calendar-x" style="font-size: 3rem; display: block; margin-bottom: 1rem;"></i><p>No events found for the selected filters.</p>';
        list.appendChild(noEvents);
    }
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const date = new Date(event.date);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    card.innerHTML = `
        <div class="event-date-box">
            <div class="event-month">${monthNames[date.getMonth()]}</div>
            <div class="event-day">${date.getDate()}</div>
        </div>
        <div class="event-details">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-meta">
                <div class="event-meta-item">
                    <i class="bi bi-calendar3"></i>
                    <span>${formatDate(date)}</span>
                </div>
                <div class="event-meta-item">
                    <i class="bi bi-tag"></i>
                    <span>${capitalizeFirst(event.type)}</span>
                </div>
            </div>
            <p class="event-description">${event.description}</p>
            <span class="event-badge event-${event.type}">${capitalizeFirst(event.type)}</span>
        </div>
    `;

    return card;
}

function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateCountdown() {
    const now = new Date();

    // Find next major event (events with isMajorEvent flag or festivals or city events)
    const upcomingEvents = calendarEvents
        .filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            return eventDate > now && (event.isMajorEvent === true || event.type === 'festival' || event.type === 'city');
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcomingEvents.length === 0) {
        document.getElementById('nextEventCountdown').style.display = 'none';
        return;
    }

    const nextEvent = upcomingEvents[0];
    const eventDate = new Date(nextEvent.date + 'T00:00:00');

    // Update event name
    document.getElementById('countdownEventName').textContent = nextEvent.title;

    // Calculate time difference
    const diff = eventDate - now;

    if (diff <= 0) {
        document.getElementById('countdownTimer').innerHTML = '<div class="countdown-item"><span class="countdown-number">Event is Today!</span></div>';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

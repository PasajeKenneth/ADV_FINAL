import React, { useState, useEffect, useRef } from 'react';
import fireDb from '../firebase';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../AuthContext';
import './Scheduler.css'; 

const Scheduler = () => {
  const { currentUser } = useAuth(); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [events, setEvents] = useState([]); 
  const [newEvent, setNewEvent] = useState(''); 
  const [newEventStartTime, setNewEventStartTime] = useState('');
  const [newEventEndTime, setNewEventEndTime] = useState('');
  const [showAddEventPopup, setShowAddEventPopup] = useState(false); 
  const [showUpdateEventPopup, setShowUpdateEventPopup] = useState(false); 
  const [updatedEventName, setUpdatedEventName] = useState(''); 
  const [updatedEventStartTime, setUpdatedEventStartTime] = useState(''); 
  const [updatedEventEndTime, setUpdatedEventEndTime] = useState(''); 
  const [selectedEventId, setSelectedEventId] = useState(null); 
  const addEventPopupRef = useRef(null);


  useEffect(() => {
    if (currentUser) {
      const eventsRef = fireDb.child('events').orderByChild('userId').equalTo(currentUser.uid);

      eventsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const eventList = [];
        if (data) { 
          for (let id in data) {
            eventList.push({ id, ...data[id] });
          }
        }
        setEvents(eventList);
      });

      return () => eventsRef.off('value');
    }
  }, [currentUser]);


  const addEvent = () => {
    if (!newEvent.trim() || !newEventStartTime.trim() || !newEventEndTime.trim()) {
      alert('Event name, start time, and end time cannot be empty');
      return;
    }

    const eventData = {
      date: selectedDate.toISOString(),
      name: newEvent,
      startTime: newEventStartTime,
      endTime: newEventEndTime,
      userId: currentUser.uid,
    };

    fireDb.child('events').push(eventData)
      .then(() => {
        setNewEvent('');
        setNewEventStartTime('');
        setNewEventEndTime(''); 
        setShowAddEventPopup(false);
        console.log('Event added successfully');
      })
      .catch((error) => {
        console.error('Error adding event:', error.message);
      });
  };

  const deleteEvent = (eventId) => {
    fireDb.child(`events/${eventId}`).remove()
      .then(() => {
        console.log('Event deleted successfully');
        setShowUpdateEventPopup(false);
      })
      .catch((error) => {
        console.error('Error deleting event:', error.message);
      });
  };


  const updateEvent = (eventId, newData) => {
    fireDb.child(`events/${eventId}`).update(newData)
      .then(() => {
        console.log('Event updated successfully');
      })
      .catch((error) => {
        console.error('Error updating event:', error.message);
      });
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  const handleDateClick = (value) => {
    setSelectedDate(value);
    setShowAddEventPopup(true);
  };


  const handleClickOutside = (event) => {
    if (addEventPopupRef.current && !addEventPopupRef.current.contains(event.target)) {
      setShowAddEventPopup(false);
      setShowUpdateEventPopup(false);
    }
  };


  const handleEscapeKeyPress = (event) => {
    if (event.key === 'Escape') {
      setShowAddEventPopup(false);
      setShowUpdateEventPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKeyPress);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, []);


  const handleUpdateChange = (event) => {
    setUpdatedEventName(event.target.value);
  };


  const handleUpdateEvent = () => {
    if (!updatedEventName.trim() || !updatedEventStartTime.trim() || !updatedEventEndTime.trim()) {
      alert('Event name, start time, and end time cannot be empty');
      return;
    }
    updateEvent(selectedEventId, {
      name: updatedEventName,
      startTime: updatedEventStartTime,
      endTime: updatedEventEndTime
    });
    setShowUpdateEventPopup(false);
  };


  const handleEventClick = (eventId, eventName, eventStartTime, eventEndTime) => {
    setShowUpdateEventPopup(true);
    setSelectedEventId(eventId);
    setUpdatedEventName(eventName);
    setUpdatedEventStartTime(eventStartTime);
    setUpdatedEventEndTime(eventEndTime);
  };

  const handleDeleteClick = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  return (
    <div className="scheduler-container"> {}
      <h2><center>Airview Gym Scheduler</center></h2>
      <Calendar 
        onChange={handleDateChange} 
        value={selectedDate} 
        className="calendar"
        onClickDay={handleDateClick} 
      /> {}
      {showAddEventPopup && (
        <div className="add-event-popup" ref={addEventPopupRef}>
          <h3>Add New Event</h3>
          <input
            type="text"
            placeholder="Event name"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
          <input
            type="time"
            placeholder="Start time"
            value={newEventStartTime}
            onChange={(e) => setNewEventStartTime(e.target.value)}
          />
          <input
            type="time"
            placeholder="End time"
            value={newEventEndTime}
            onChange={(e) => setNewEventEndTime(e.target.value)}
          />
          <button onClick={addEvent}>Add Event</button>
        </div>
      )}
      {showUpdateEventPopup && (
        <div className="add-event-popup" ref={addEventPopupRef}>
          <h3>Update Event</h3>
          <input
            type="text"
            placeholder="Event name"
            value={updatedEventName}
            onChange={handleUpdateChange}
          />
          <input
            type="time"
            placeholder="Start time"
            value={updatedEventStartTime}
            onChange={(e) => setUpdatedEventStartTime(e.target.value)}
          />
          <input
            type="time"
            placeholder="End time"
            value={updatedEventEndTime}
            onChange={(e) => setUpdatedEventEndTime(e.target.value)}
          />
          <button onClick={handleUpdateEvent}>Update Event</button>
        </div>
      )}
      <div>
        <h3>Events for {selectedDate.toDateString()}</h3> {}
        <ul className="event-list">
          {events
            .filter((event) => event.date.startsWith(selectedDate.toISOString().split('T')[0]))
            .map((event) => (
              <li key={event.id} className="event-card" onClick={() => handleEventClick(event.id, event.name, event.startTime, event.endTime)}>
                {event.name} ({event.startTime} - {event.endTime})
                <button onClick={() => handleDeleteClick(event.id)}>Delete</button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Scheduler;

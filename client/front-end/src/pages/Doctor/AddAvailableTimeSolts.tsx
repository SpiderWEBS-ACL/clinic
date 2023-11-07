import React, { useState } from "react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const Calendar: React.FC = () => {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>(
    {}
  );

  const handleTimeSlotClick = (day: string, timeSlot: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      const daySelection = prevSelectedSlots[day];
      if (daySelection && daySelection.includes(timeSlot)) {
        // Unselect the time slot if it's already selected
        return {
          ...prevSelectedSlots,
          [day]: daySelection.filter((selected) => selected !== timeSlot),
        };
      } else {
        // Select the time slot
        return {
          ...prevSelectedSlots,
          [day]: daySelection ? [...daySelection, timeSlot] : [timeSlot],
        };
      }
    });
  };

  return (
    <div className="calendar">
      {daysOfWeek.map((day) => (
        <div key={day} className="day">
          <h2>{day}</h2>
          {timeSlots.map((timeSlot) => (
            <button
              key={timeSlot}
              onClick={() => handleTimeSlotClick(day, timeSlot)}
              style={{
                backgroundColor: selectedSlots[day]?.includes(timeSlot)
                  ? "#80ff80"
                  : "#f0f0f0",
                border: "1px solid #ccc",
                margin: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
              className="btn btn-light"
            >
              {timeSlot}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;

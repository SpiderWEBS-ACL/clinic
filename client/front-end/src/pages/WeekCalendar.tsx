import React from "react";

interface WeekCalendarProps {
  days: string[];
  timeSlots: string[];
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ days, timeSlots }) => {
  var color = "btn";
  return (
    <div>
      <h2>Week Calendar</h2>
      <div className="week-days">
        {days.map((day, index) => (
          <div key={index}>
            <h3>{day}</h3>
            {timeSlots.map((timeSlot, slotIndex) => (
              <button
                className={color}
                onClick={() => (color = "btn btn-primary")}
                key={slotIndex}
              >
                {timeSlot}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;

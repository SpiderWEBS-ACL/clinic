import { Button } from "antd";
import React, { useEffect, useState } from "react";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  // Add more time slots here
];

const AppointmentBookingPage: React.FC = () => {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>(
    {}
  );

  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);

  useEffect(() => {
    // Generate the days of the week as real-time data
    const today = new Date();
    const daysOfWeekArray = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = date.toISOString().split("T")[0];
      daysOfWeekArray.push(formattedDate);
    }

    setDaysOfWeek(daysOfWeekArray);
  }, []);

  const handleTimeSlotClick = (day: string, timeSlot: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      const daySelection = prevSelectedSlots[day] || [];
      if (daySelection.includes(timeSlot)) {
        return {
          [day]: daySelection.filter((selected) => selected !== timeSlot),
        };
      } else {
        return {
          [day]: [timeSlot],
        };
      }
    });
    console.log(selectedSlots);
  };

  return (
    <div className="appointment-booking">
      <h2>Book an Appointment</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot}>
              <td>{timeSlot}</td>
              {daysOfWeek.map((day) => (
                <td key={day}>
                  <Button
                    onClick={() => handleTimeSlotClick(day, timeSlot)}
                    className={
                      selectedSlots[day]?.includes(timeSlot)
                        ? "selected"
                        : "available"
                    }
                    style={{
                      backgroundColor: selectedSlots[day]?.includes(timeSlot)
                        ? "#007bff"
                        : "#f0f0f0",
                      color: selectedSlots[day]?.includes(timeSlot)
                        ? "white"
                        : "black",
                      // Add any other inline styles you need
                    }}
                  >
                    {timeSlot}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h2></h2>
    </div>
  );
};

export default AppointmentBookingPage;

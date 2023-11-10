import { ApiFilled } from "@ant-design/icons";
import { Button, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { config, headers } from "../../Middleware/authMiddleware";

const daysOfWeek = ["Select your available time slots"];
const api = axios.create({
  baseURL: "http://localhost:8000/",
});

const timeSlots = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

const Calendar: React.FC = () => {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>(
    {}
  );

  const handleTimeSlotClick = (day: string, timeSlot: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      const daySelection = prevSelectedSlots[day];
      if (daySelection && daySelection.includes(timeSlot)) {
        const updatedSelection = daySelection.filter(
          (selected) => selected !== timeSlot
        );
        return {
          ...prevSelectedSlots,
          [day]: updatedSelection,
        };
      } else {
        const updatedSelection = daySelection
          ? [...daySelection, timeSlot]
          : [timeSlot];
        return {
          ...prevSelectedSlots,
          [day]: updatedSelection,
        };
      }
    });
  };
  const slots: string[] = [];
  for (const day of daysOfWeek) {
    if (selectedSlots[day]) {
      for (const timeSlot of selectedSlots[day]) {
        const timestamp = `${timeSlot}:00`;
        slots.push(timestamp);
      }
    }
  }
  const handleSave = () => {
    api
      .put("/doctor/addTimeSlots", { slots: slots }, { headers: headers })
      .then((response) => {
        message.success("Time slots added successfully!");
      })
      .catch((error) => {
        message.error("an error has occurred");
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
      <div style={{ textAlign: "center", margin: "20px auto" }}>
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
      <div>
        <h3>Selected Slots:</h3>
        <ul>
          {slots.map((slot) => (
            <li key={slot}>{slot}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;

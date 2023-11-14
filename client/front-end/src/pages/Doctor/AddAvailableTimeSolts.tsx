import { Button, Select, Spin, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { config, headers } from "../../Middleware/authMiddleware";
const { Option } = Select;
const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const api = axios.create({
  baseURL: "http://localhost:8000/",
});

const timeSlots = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const Calendar: React.FC = () => {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const getTimeSlotsApi = () => {
    api.get("doctor/getAvailableTimeSlots", config).then((response) => {
      console.log(response.data);
      setSelectedSlots(response.data);
    });
    setLoading(false);
  };

  useEffect(() => {
    getTimeSlotsApi();
  }, []);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
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
    console.log(selectedSlots);
    console.log(selectedSlots["Monday"]);
    api
      .put(
        "/doctor/addTimeSlots",
        [
          selectedSlots["Saturday"],
          selectedSlots["Sunday"],
          selectedSlots["Monday"],
          selectedSlots["Tuesday"],
          selectedSlots["Wednesday"],
          selectedSlots["Thursday"],
          selectedSlots["Friday"],
        ],
        { headers: headers }
      )
      .then(() => {
        message.success("Time slots added successfully!");
      })
      .catch(() => {
        message.error("an error has occurred");
      });
    api.put("doctor/loggedInFirstTime", [], { headers: headers }).catch(() => {
      message.error("an error has occurred");
    });
  };
  const buttonStyle = {
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    margin: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  };

  const handleTimeSlotSelect = (day: string, selectedValues: string[]) => {
    setSelectedSlots((prevSelectedSlots) => ({
      ...prevSelectedSlots,
      [day]: selectedValues,
    }));
  };
  const boxStyle = {
    marginBottom: "0.6rem",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const dayStyle = {
    color: "#1890ff",
    fontSize: "1rem",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>
        <strong>Select your weekly time slots</strong>
      </h2>
      {daysOfWeek.map((day) => (
        <div key={day} style={boxStyle}>
          <h2 style={dayStyle}>{day}</h2>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder={`Select time slots for ${day}`}
            value={selectedSlots[day]}
            onChange={(values) => handleTimeSlotSelect(day, values)}
          >
            {timeSlots.map((timeSlot) => (
              <Option key={timeSlot} value={timeSlot}>
                {timeSlot}
              </Option>
            ))}
          </Select>
        </div>
      ))}
      <div>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Calendar;

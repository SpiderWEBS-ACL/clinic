import { Button, Select, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAvailableTimeSlots } from "../../apis/Doctor/Time Slots/GetAvailableTimeSlots";
import { editAvailableTimeSlots } from "../../apis/Doctor/Time Slots/EditAvailableTimeSlots";
import { firstTimeLogin } from "../../apis/Doctor/Registration/FirstTimeLogIn";
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
  const getTimeSlotsApi = async () => {
    try {
      const response = await getAvailableTimeSlots();
      setSelectedSlots(response.data);
    } catch (error) {
      console.log(error);
    }
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
  const handleSave = async () => {
    await editAvailableTimeSlots(
      selectedSlots["Saturday"],
      selectedSlots["Sunday"],
      selectedSlots["Monday"],
      selectedSlots["Tuesday"],
      selectedSlots["Wednesday"],
      selectedSlots["Thursday"],
      selectedSlots["Friday"]
    )
      .then(() => {
        message.success("Time slots added successfully!");
      })
      .catch(() => {
        message.error("an error has occurred");
      });
    await firstTimeLogin().catch(() => {
      message.error("an error has occurred");
    });
  };

  const handleTimeSlotSelect = (day: string, selectedValues: string[]) => {
    setSelectedSlots((prevSelectedSlots) => ({
      ...prevSelectedSlots,
      [day]: selectedValues,
    }));
  };
  const boxStyle = {
    marginTop: "1rem",
    marginBottom: "0.6rem",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const dayStyle = {
    color: "#000000",
    fontSize: "1rem",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2 style={{ color: "#1890ff", marginBottom:"2rem" }}>
        Select your weekly time slots
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

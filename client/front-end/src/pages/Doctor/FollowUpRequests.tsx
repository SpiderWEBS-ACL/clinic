import React, { useEffect, useState } from "react";
import { Button, Radio, Space, Spin, Table, Tag, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useParams } from "react-router-dom";
import { getAllFollowUpRequests } from "../../apis/Doctor/Appointments/getAllFollowUpRequests";
import { rejectFollowUpRequest } from "../../apis/Doctor/Appointments/RejectFollowUpRequest";
import { acceptFollowUpRequest } from "../../apis/Doctor/Appointments/acceptFollowUpRequest";

const FollowUpRequests = () => {
  const { id } = useParams();
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAccept = async(id: any) => {
    try {
      setLoading(true);
      await acceptFollowUpRequest(id).then((response) => {
        message.success(response.data);
        fetchRequests();
      });
    } catch (error: any) {
      message.error(error.response.data.error);
    }
  };
  const handleReject = async (id: any) => {
    try {
      setLoading(true);
      await rejectFollowUpRequest(id).then((response) => {
        message.success(response.data);
        fetchRequests();
      });
    } catch (error: any) {
      message.error(error.response.data.error);
    }
  };
  const columns = [
    {
      title: "Patient Name",
      dataIndex: "Patient",
      key: "Patient",
      render: (patient: any) => <span>{patient.Name}</span>,
    },
    {
      title: "Appointment Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (AppointmentDate: any) => (
        <span>{new Date(AppointmentDate).toDateString()}</span>
      ),
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      render: (start: any) => <span>{start.split("T")[1].split(".")[0]}</span>,
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      render: (end: any) => <span>{end.split("T")[1].split(".")[0]}</span>,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (record: any) => (
        <Space size="middle">
          <Button
            style={{ color: "green" }}
            type="default"
            onClick={() => handleAccept(record._id)}
          >
            Accept
          </Button>
          <Button
            danger
            type="default"
            onClick={() => handleReject(record._id)}
          >
            {" "}
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const fetchRequests = () => {
    getAllFollowUpRequests(id).then((response) => {
      setFollowUps(response.data);
    });
    setLoading(false);
  };

  useEffect(() => {
    sessionStorage.clear();
    fetchRequests();
  }, [id]);

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
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">FollowUp Requests</h2>

      <div style={{ justifyContent: "center", alignItems: "center" }}>
        <Table
          style={{ minWidth: "150vh" }}
          columns={columns}
          dataSource={followUps}
        />
      </div>
    </div>
  );
};

export default FollowUpRequests;

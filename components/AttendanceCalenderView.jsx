import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/constant";
import { Calendar } from "react-native-calendars";

const AttendanceCalenderView = ({ studentId }) => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchAttendanceData = async (month, year) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/students/getAttendanceCalanderView`,
        {
          studentId: studentId,
          month: month.toString().padStart(2, "0"),
          year: year.toString(),
        }
      );

      console.log(JSON.stringify(res.data, null, 2));
      if (res.data.success) {
        const formattedData = {};
        res.data.formattedAttendanceData.forEach((item) => {
          formattedData[item.date] = {
            customStyles: {
              container: {
                backgroundColor: item.status === "Present" ? "green" : "red",
              },
              text: {
                color: "white",
                fontWeight: "bold",
              },
            },
          };
        });
        setAttendanceData(formattedData);
      } else {
        setError("Failed to fetch attendance data");
      }
    } catch (error) {
      console.error(error);
      setError("Error fetching attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studentId) {
      setError("Student ID is missing");
      setLoading(false);
      return;
    }

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    fetchAttendanceData(month, year);
  }, [studentId, currentDate]);

  const onMonthChange = (date) => {
    setCurrentDate(new Date(date.dateString));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        current={currentDate.toISOString().split("T")[0]}
        markedDates={attendanceData}
        markingType={"custom"}
        onMonthChange={onMonthChange}
      />
    </View>
  );
};

export default AttendanceCalenderView;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  errorText: {
    color: "red",
  },
  calendarContainer: {
    flex: 1,
  },
});

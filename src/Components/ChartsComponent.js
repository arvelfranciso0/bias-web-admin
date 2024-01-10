import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ChartComponent = () => {
  const chartRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_NETWORK_ADD}/admin/listofuser`)
      .then((res) => {
        if (res.data.status) {
          const initialData = res.data.result;

          if (initialData && chartRef.current) {
            const userRegistrationByMonth = initialData.reduce(
              (result, user) => {
                const registrationDate = new Date(user.user_created_at);
                const registrationYear = registrationDate.getFullYear();
                const registrationMonth = registrationDate.getMonth() + 1; // Months are zero-based, so add 1

                const key = `${registrationYear}-${registrationMonth}`;
                result[key] = (result[key] || 0) + 1;

                return result;
              },
              {}
            );

            // console.log(userRegistrationByMonth);
            const formattedData = Object.entries(userRegistrationByMonth).map(
              ([key, count]) => {
                const [year, month] = key.split("-").map(Number);

                return {
                  year,
                  month,
                  count,
                };
              }
            );

            const chartConfig = {
              type: "line",
              data: {
                labels: formattedData.map(
                  (row) => `${row.year} - ${row.month}`
                ),
                datasets: [
                  {
                    label: "Users Register by Month",
                    data: formattedData.map((row) => row.count),
                  },
                ],
              },
            };

            const ctx = chartRef.current.getContext("2d");

            // Check if a chart instance already exists
            if (ctx.chart) {
              ctx.chart.destroy();
            }

            ctx.chart = new Chart(ctx, chartConfig);
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          navigate("/server-error");
        } else if (error.request) {
          navigate("/error");
        } else {
          navigate("/somethingwrong");
        }
      });
  }, []); // Empty dependency array ensures that the effect runs once on mount

  return (
    <canvas ref={chartRef} id="acquisitions" width="200" height="100"></canvas>
  );
};

export default ChartComponent;

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function CharstForEarnings(props) {
  const chartRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_NETWORK_ADD}/admin/earnings`)
      .then((res) => {
        if (res.data.status) {
          console.log(res.data.result);
          const initialData = res.data.result;

          if (initialData && chartRef.current) {
            const earningsByYear = initialData.reduce((result, earnings) => {
              const year = new Date(earnings.earnings_created_at).getFullYear();
              result[year] = (result[year] || 0) + earnings.earnings_amt;
              return result;
            }, {});

            const earningsObject = Object.entries(earningsByYear).map(
              ([key, earn]) => {
                return {
                  year: key,
                  earn,
                };
              }
            );

            const chartConfig = {
              type: "line",
              data: {
                labels: earningsObject.map((row) => `${row.year}`),
                datasets: [
                  {
                    label: "Earnings By Year",
                    data: earningsObject.map((row) => row.earn),
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
  }, []);
  return (
    <canvas ref={chartRef} id="acquisitions" width="200" height="100"></canvas>
  );
}

export default CharstForEarnings;

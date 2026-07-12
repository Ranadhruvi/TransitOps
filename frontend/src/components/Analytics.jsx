import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Analytics = () => {
  const [summary, setSummary] = useState({ available_vehicles: 0, active_trips: 0, total_repair_cost: 0 });
  const [fuelData, setFuelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch top-level summary stats
    fetch('http://localhost:5000/analytics/summary')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSummary({
            available_vehicles: data.available_vehicles || 0,
            active_trips: data.active_trips || 0,
            total_repair_cost: data.total_repair_cost || 0
          });
        }
      })
      .catch(err => console.error("Summary fetch error:", err));

    // 2. Fetch chart data with a guaranteed loading cutoff
    fetch('http://localhost:5000/analytics/fuel-trends')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error("Backend Error:", data.error);
          setFuelData([]); // Reset to empty if error
        } else {
          // Format data safely
          const formattedData = Array.isArray(data) ? data.map(item => ({
            month: item.month,
            total_spent: Number(item.total_spent) || 0,
            total_liters: Number(item.total_liters) || 0
          })) : [];
          setFuelData(formattedData);
        }
      })
      .catch(err => console.error("Chart fetch error:", err))
      .finally(() => {
        // MAGIC FIX: .finally() runs no matter what happens above.
        // It guarantees the loading text will disappear.
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <h4 className="mb-4 text-secondary">Fleet Analytics & Forecasting</h4>

      {/* Top Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-success border-4 h-100 p-3">
            <h6 className="text-muted mb-2">AVAILABLE VEHICLES</h6>
            <h2 className="mb-0">{summary.available_vehicles}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100 p-3">
            <h6 className="text-muted mb-2">ACTIVE DISPATCHES</h6>
            <h2 className="mb-0">{summary.active_trips}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100 p-3">
            <h6 className="text-muted mb-2">YTD MAINTENANCE COST</h6>
            <h2 className="mb-0">₹{Number(summary.total_repair_cost).toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Line Chart: Fuel Spending Trends */}
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h6 className="text-muted mb-4">FUEL EXPENDITURE TRENDS (₹)</h6>
            {loading ? (
              <div className="text-center py-5 text-muted">Loading chart data...</div>
            ) : fuelData.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded">
                Not enough fuel data to generate trends. Log some expenses first.
              </div>
            ) : (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={fuelData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="total_spent" name="Total Cost (₹)" stroke="#0d6efd" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart: Volume Trends */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h6 className="text-muted mb-4">FUEL VOLUME (Liters)</h6>
            {loading ? (
              <div className="text-center py-5 text-muted">Loading...</div>
            ) : fuelData.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded">
                No data.
              </div>
            ) : (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={fuelData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <Tooltip />
                    <Bar dataKey="total_liters" name="Volume (L)" fill="#ffc107" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
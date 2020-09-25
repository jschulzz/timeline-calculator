import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import './Graph.scss';

let knownVals = {};

const evaluate = async (varName, date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  let values = undefined;
  if (!Object.keys(knownVals).includes(varName)) {
    const [{ name, id, timeValues }] = await (
      await fetch(`http://localhost:8000/variable/${varName}`)
    ).json();
    knownVals[varName] = { name, id, timeValues };
  }
  values = knownVals[varName];
  const dateRange = [...values.timeValues];
  dateRange.push({ date, value: null });
  const sortedDateRange = dateRange.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  const locationOfDate = sortedDateRange.findIndex((v) => v.value === null);
  if (locationOfDate === 0) {
    return { date, value: 0 };
  }
  const valueAtDate = sortedDateRange[locationOfDate - 1];
  return valueAtDate;
};

const Graph = () => {
  const trackedVariable = 'wealth';
  const [data, setData] = useState([]);
  useEffect(() => {
    const getTimeline = async () => {
      const today = new Date('12/31/2020');
      const timeline = [];
      for (
        let day = new Date('8/10/2020');
        day <= today;
        day.setDate(day.getDate() + 1)
      ) {
        const value = await evaluate(trackedVariable, day);
        timeline.push({ x: day.toString(), y: value.value });
      }
      setData(timeline);
    };
    getTimeline();
  }, []);

  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      type: 'datetime',
    },
  };
  const series = [
    {
      name: 'series-1',
      data,
    },
  ];
  return (
    <div className="Graph">
      <Chart options={options} series={series} type="line" width="500" />
    </div>
  );
};

export default Graph;

import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import { saveAs } from 'file-saver';

function WordFrequency() {
  const [words, setWords] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWordFrequency = async () => {
    setLoading(true);
    const response = await fetch(
      'https://www.terriblytinytales.com/test.txt'
    );
    const text = await response.text();
    const wordArray = text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/);
    const frequencyMap = new Map();
    wordArray.forEach((word) => {
      frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
    });
    const sortedWords = [...frequencyMap.entries()].sort((a, b) =>
      b[1] - a[1]
    );
    setWords(sortedWords.slice(0, 20));
    
    setLoading(false);
  };

  const exportCsv = () => {
    const csvData = words
      .map((word) => `${word[0]},${word[1]}`)
      .join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'word-frequency.csv');
  };

  const createChart = () => {
    const canvas = document.getElementById('word-frequency-chart');
    if (!canvas || !words) return;
    const labels = words.map((word) => word[0]);
    const data = words.map((word) => word[1]);
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Word Frequency',
            data,
            backgroundColor: 'red',
            borderColor: 'black',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                precision: 0,
              },
            },
          ],
        },
      },
    });
  };

  const Submit = () => {
    
    fetchWordFrequency();
  };

  return (
    <div>
      <h2>Sampurna Thakur's Assigment of TTT</h2>
      <button onClick={Submit}>{loading ? 'Loading...' : 'Submit'}</button>
      {words && (
        <div style={{ width: '100%', height: '100%' }}>
          <div  style={{width: '70%', height: '70%', marginLeft: '220px'}}>
            <canvas id="word-frequency-chart" ref={createChart} />
            <button onClick={exportCsv}>Export</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WordFrequency;

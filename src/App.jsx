import { useState, useEffect } from 'react';
import './App.css';
import List from './components/List';

function App() {
  const [exhibitions, setExhibitions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartYear, setSelectedStartYear] = useState('');
  const [selectedEndYear, setSelectedEndYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const callAPI = async () => {
    try {
      const response = await fetch('https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.exhibitions.getList&access_token=e515067fcebc0a16fe143ef43f310b70&page=1&per_page=20');
      if (!response.ok) {
        throw new Error('Failed to fetch exhibitions');
      }     
      const data = await response.json(); 
      const exhibitions = data.exhibitions;
      setExhibitions(exhibitions);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const acquisitionYears = exhibitions.map((exhibition) => parseInt(exhibition.date_start.split('-')[0]));
  const earliestAcquisitionYear = Math.min(...acquisitionYears);
  const latestAcquisitionYear = Math.max(...acquisitionYears);

  useEffect(() => {
    callAPI();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStartYearChange = (event) => {
    setSelectedStartYear(event.target.value);
  };

  const handleEndYearChange = (event) => {
    setSelectedEndYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedStartYear('');
    setSelectedEndYear('');
    setSelectedMonth('');
  };

  const filteredExhibitions = exhibitions.filter((exhibition) => {
    const titleMatches = exhibition.title.toLowerCase().includes(searchQuery.toLowerCase());
    const startYearMatches = selectedStartYear ? exhibition.date_start.startsWith(selectedStartYear) : true;
    const endYearMatches = selectedEndYear ? exhibition.date_end.startsWith(selectedEndYear) : true;
    const monthMatches = selectedMonth ? exhibition.date_start.split('-')[1] === selectedMonth : true;
    return titleMatches && startYearMatches && endYearMatches && monthMatches;
  });

  const yearOptions = [];
  for (let year = 2019; year <= 2024; year++) {
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }

  const monthOptions = [];
  for (let month = 1; month <= 12; month++) {
    const formattedMonth = month.toString().padStart(2, '0');
    monthOptions.push(
      <option key={formattedMonth} value={formattedMonth}>
        {formattedMonth}
      </option>
    );
  }


  return (
    <div className="App">
      <div className="header">
        <h1>Online Museum Date</h1>
      </div>
      <div className="stat-summary">
        <div className="stat-card">Total Exhibitions: {exhibitions.length}</div>
        <div className="stat-card">Earliest Acquisition Year: {earliestAcquisitionYear}</div>
        <div className="stat-card">Latest Acquisition Year: {latestAcquisitionYear}</div>
      </div>
      <div className="filter">
        <input
          type="text"
          placeholder="Search exhibitions..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={selectedStartYear} onChange={handleStartYearChange}>
          <option value="">Start Year</option>
          {yearOptions}
        </select>
        <select value={selectedEndYear} onChange={handleEndYearChange}>
          <option value="">End Year</option>
          {yearOptions}
        </select>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="">Month</option>
          {monthOptions}
        </select>
        <button onClick={handleReset}>Reset</button>
      </div>
      <List data={filteredExhibitions} />
    </div>
  );
}

export default App;

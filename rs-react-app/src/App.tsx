import React from 'react';
import Header from './Header';
import Main from './Main';

function App() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<string[]>([]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('Searching for:', searchTerm);
      setResults(searchTerm ? [`${searchTerm} #1`, `${searchTerm} #2`] : []);
      setLoading(false);
    }, 1000);
  };

  const handleThrowError = () => {
    throw new Error('Test error boundary');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        loading={loading}
        onThrowError={handleThrowError}
      />
      <Main loading={loading} searchTerm={searchTerm} results={results} />
    </div>
  );
}

export default App;

import { Component } from 'react';

interface MainProps {
  loading: boolean;
  searchTerm: string;
  results: string[];
}

class Main extends Component<MainProps> {
  render() {
    const { loading, searchTerm, results } = this.props;

    if (loading) {
      return <main className="main__loading">Loading...</main>;
    }

    return (
      <main className="main">
        <h2 className="main__title">Results for `{searchTerm}`</h2>

        {results.length === 0 ? (
          <p className="text">No results found.</p>
        ) : (
          <ul className="items-list">
            {results.map((name) => (
              <li key={name} className="item">
                {name}
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  }
}

export default Main;

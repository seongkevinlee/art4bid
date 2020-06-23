import React from 'react';
import SearchPage from './search-page';
import NavBar from './navbar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      view: 'search'
    };
    this.setView = this.setView.bind(this);
  }

  setView(currentView) {
    this.setState({ view: currentView });
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    let pageBody;
    if (this.state.view === 'search') {
      pageBody = <SearchPage setView = {this.setView}/>;
    } else {
      pageBody = <h1>Hi</h1>;
    }
    return (
      <div>
        {pageBody}
        <NavBar view={this.state.view} setView={this.setView} />
      </div>
    );

  }

}

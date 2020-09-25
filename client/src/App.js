import React from 'react';
import './App.css';
import VariableList from './components/VariableList/VariableList';
import Graph from './components/Graph/Graph';
import 'bulma/css/bulma.css';
function App() {
  return (
    <div className="App">
      <div className="columns">
        <VariableList className="column" />
        <div className="column">
          <Graph />
        </div>
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import './Variable.scss';

const Variable = ({ variable, updateVariables }) => {
  const deleteVariable = async () => {
    const deleteResponse = await fetch('http://localhost:8000/variable', {
      method: 'DELETE',
      body: JSON.stringify({ id: variable.id }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (deleteResponse.status === 200) {
      updateVariables();
    }
  };
  return (
    <div className="panel-block">
      {/* <a > */}
      {variable.name}
      {/* </a> */}
      <div className="buttons has-addons is-right">
        <button className="button is-small">Edit</button>
        <button className="button is-small is-danger" onClick={deleteVariable}>
          Delete
        </button>
      </div>
    </div>
  );
};

Variable.propTypes = {};

Variable.defaultProps = {};

export default Variable;

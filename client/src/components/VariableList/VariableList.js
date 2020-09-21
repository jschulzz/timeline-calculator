import React, { useState, useEffect } from 'react';
import './VariableList.scss';
import Variable from '../Variable/Variable';
import AddVariableForm from '../AddVariableForm/AddVariableForm';

const VariableList = () => {
  const [variables, setVariables] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    updateVariables();
  }, []);

  const updateVariables = async () => {
    const data = await fetch('http://localhost:8000/');
    setVariables(await data.json());
  };
  const addNewVariable = () => {
    setOpenModal(true);
  };

  return (
    <div className="column">
      <div className={`modal${openModal ? ' is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <AddVariableForm
            setOpenModal={setOpenModal}
            updateVariables={updateVariables}
          />
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setOpenModal(false)}
        ></button>
      </div>
      <nav className="panel">
        <p className="panel-heading">Variables</p>{' '}
        {variables.map((variable) => {
          return (
            <Variable
              variable={variable}
              key={variable._id}
              updateVariables={updateVariables}
            />
          );
        })}
        <div className="panel-block">
          <button
            className="button is-small is-success is-pulled-right"
            onClick={addNewVariable}
          >
            Add Variable
          </button>
        </div>
      </nav>
    </div>
  );
};

VariableList.propTypes = {};

VariableList.defaultProps = {};

export default VariableList;

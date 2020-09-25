import React, { useState } from 'react';
import EditVariableForm from '../EditVariableForm/EditVariableForm';
import './Variable.scss';

const Variable = ({ variable, updateVariables }) => {
  const [openModal, setOpenModal] = useState(false);

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
    <React.Fragment>
      <div className={`modal${openModal ? ' is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <EditVariableForm
            variable={variable}
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
      <div className="panel-block">
        {/* <a > */}
        {variable.name}
        {/* </a> */}
        <div className="buttons has-addons is-right">
          <button
            className="button is-small"
            onClick={() => setOpenModal(true)}
          >
            Edit
          </button>
          <button
            className="button is-small is-danger"
            onClick={deleteVariable}
          >
            Delete
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

Variable.propTypes = {};

Variable.defaultProps = {};

export default Variable;

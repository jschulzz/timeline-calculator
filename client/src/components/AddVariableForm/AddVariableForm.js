import React, { useState } from 'react';
import { Formik } from 'formik';
import './AddVariableForm.scss';

const defaultForm = { name: '', id: '' };

const AddVariableForm = ({ setOpenModal, updateVariables }) => {
  const closeModal = (event) => {
    // setFormInput(defaultForm);
    setOpenModal(false);
  };

  const submitForm = async (formValues) => {
    return new Promise(async (resolve, reject) => {
      console.log(formValues);
      const response = await fetch('http://localhost:8000/variable', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        updateVariables();
        closeModal();
        resolve(true);
      } else {
        console.log('Error', response);
        reject(new Error('Variable ID In Use'));
      }
    });
  };

  //   const handleInputChange = (event) => {
  //     switch (event.target.id) {
  //       case 'name':
  //         setFormInput({ name: event.target.value, id: formInput.id });
  //         break;
  //       case 'id':
  //         setFormInput({ name: formInput.name, id: event.target.value });
  //         break;
  //     }
  //   };
  return (
    <Formik
      initialValues={defaultForm}
      validate={(values) => {
        const errors = {};
        if (!values.id) {
          errors.id = 'Required';
        }
        if (!values.name) {
          errors.name = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, actions) => {
        try {
          submitForm(values);
        } catch (error) {
          actions.console.log(error);
          actions.setErrors('id', error.message);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form className="box">
          <div className="field">
            <label className="label">Variable Name</label>
            <div className="control">
              <input
                className={`input${errors.name ? ' is-danger' : ''}`}
                type="text"
                placeholder="Variable Name"
                id="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
            </div>
            {errors.name && touched.name && (
              <p className="help is-danger">{errors.name}</p>
            )}
          </div>
          <div className="field">
            <label className="label">Variable ID</label>
            <div className="control">
              <input
                className={`input${errors.id ? ' is-danger' : ''}`}
                type="text"
                id="id"
                placeholder="Variable ID"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.id}
              />
            </div>
            {errors.id && touched.id && (
              <p className="help is-danger">{errors.id}</p>
            )}
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-link" type="submit">
                Submit
              </button>
            </div>
            <div className="control">
              <button className="button is-link is-light" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

AddVariableForm.propTypes = {};

AddVariableForm.defaultProps = {};

export default AddVariableForm;

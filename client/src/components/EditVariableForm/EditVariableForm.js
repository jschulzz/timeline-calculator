import React, { useEffect, useState } from 'react';
import { Formik, Field, FieldArray } from 'formik';
import './EditVariableForm.scss';
import bulmaCalendar from 'bulma-calendar';
import 'bulma-calendar/dist/css/bulma-calendar.min.css';

const defaultForm = { name: '', id: '' };

const TextField = ({ field, form, ...props }) => {
  const { label, placeholder, disabled } = props;
  const { name } = field;
  const { errors, touched, values, handleChange, handleBlur } = form;
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <input
          className={`input`}
          type="text"
          id={name}
          placeholder={placeholder}
          value={values[name]}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {errors[name] && touched[name] && (
        <p className="help is-danger">{errors[name]}</p>
      )}
    </div>
  );
};

const ValueField = ({ field, form, ...props }) => {
  const { label, placeholder, disabled, index, variable } = props;
  const { name, value } = field;
  const { handleChange, handleBlur } = form;
  return (
    <div className="columns">
      <div className="column">
        <div className="field">
          <label className="label">{label}</label>
          <div className="control">
            <input
              className={`input ${variable.id}`}
              id={name}
              name={name + '.date'}
              placeholder={placeholder}
              value={value.date}
              disabled={disabled}
              onChange={handleChange}
              onBlur={handleBlur}
              type="date"
              data-start-date={value.date}
            />
          </div>
        </div>
      </div>
      <div className="column">
        <div className="field">
          <label className="label">{label}</label>
          <div className="control">
            <input
              className={`input`}
              type="text"
              id={name}
              name={name + '.value'}
              placeholder={placeholder}
              value={value.value}
              disabled={disabled}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const EditVariableForm = ({ variable, setOpenModal, updateVariables }) => {
  const [dateList, setDateList] = useState(
    variable.timeValues.map((x) => x.date)
  );
  const [calendars, setCalendars] = useState([]);
  const closeModal = (event) => {
    // setFormInput(defaultForm);
    setOpenModal(false);
  };

  const makeCalendars = () => {
    const newCalendars = bulmaCalendar.attach(`.${variable.id}[type="date"]`, {
      displayMode: 'dialog',
      isRange: false,
      type: 'date',
      onReady: (calendar) => {
        // this is dumb?
        const v = calendar.data.startDate;
        calendar.data.clear();
        calendar.data.value(v);
        calendar.data.refresh();
      },
    });
    console.log('Making Calendars - ', newCalendars.length);

    newCalendars.forEach((calendar, idx) => {
      calendar.on('select', (cal) => {
        console.log(cal.data.value(), idx);
        cal.data.save();
        let newDates = [...dateList];
        console.log('changing', newDates);
        newDates[idx] = cal.data.value();
        console.log('to', newDates);
        setDateList(newDates);
      });
    });
    setCalendars(newCalendars);
  };

  useEffect(() => {
    makeCalendars();
  }, []);

  const submitForm = async (formValues) => {
    return new Promise(async (resolve, reject) => {
      const today = new Date();
      let formatted_date =
        today.getMonth() +
        1 +
        '/' +
        today.getDate() +
        '/' +
        today.getFullYear();
      console.log(formValues);
      let updatedData = formValues;
      updatedData.timeValues.forEach((v, idx) => {
        v.date = dateList[idx] || formatted_date;
      });
      console.log(updatedData);
      const response = await fetch('http://localhost:8000/variable', {
        method: 'PATCH',
        body: JSON.stringify(updatedData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        updateVariables();
        closeModal();
        resolve();
      } else {
        reject(response);
      }
    });
  };

  return (
    <Formik
      initialValues={variable}
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
      onSubmit={async (values, actions) => {
        console.log('Submitting');
        try {
          await submitForm(values);
        } catch (error) {
          // actions.setErrors({ id: error.statusText });
          console.log(error);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <div className="box">
          <p className="is-size-2">Edit Variable</p>
          <form onSubmit={handleSubmit}>
            <div className="section columns">
              <div className="column">
                <Field
                  component={TextField}
                  placeholder=""
                  label="Variable Name"
                  name="name"
                ></Field>
              </div>
              <div className="column">
                <Field
                  component={TextField}
                  placeholder=""
                  label="Variable ID"
                  name="id"
                  disabled={true}
                ></Field>
              </div>
            </div>
            <div className="section pb-1">
              <FieldArray
                name="timeValues"
                render={(arrayHelpers) => {
                  return (
                    <div>
                      {values.timeValues.map((value, index) => {
                        return (
                          <div key={index}>
                            <Field
                              name={`timeValues.${index}`}
                              placeholder=""
                              index={index}
                              component={ValueField}
                              variable={variable}
                            />
                          </div>
                        );
                      })}
                      <button
                        className={`button is-link is-success `}
                        type="button"
                        onClick={() => {
                          arrayHelpers.push({
                            date: new Date(),
                            value: 0,
                          });
                          console.log(values);
                          makeCalendars();
                        }}
                      >
                        Add Change Date
                      </button>
                    </div>
                  );
                }}
              />
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button
                  className={`button`}
                  disabled={isSubmitting}
                  type="submit"
                >
                  Submit
                </button>
              </div>
              <div className="control">
                <button
                  className="button is-light"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

EditVariableForm.propTypes = {};

EditVariableForm.defaultProps = {};

export default EditVariableForm;

import React, { useState, useContext, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactForm = () => {
  //initialize context to use methods, contactcontext state/functions
  const contactContext = useContext(ContactContext);

  //get access to the things we need from the context
  const {
    addContact,
    clearCurrentContact,
    updateContact,
    current,
  } = contactContext;

  //useEffect mimics componenetDidMount and runs as sooon as component mounts on the dom
  //when we click edit i want to get the current values
  useEffect(() => {
    if (current !== null) {
      setContact(current);
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        type: 'personal',
      });
    }
    // we want to change the contact only if the context changes or the current value
  }, [contactContext, current]);

  //set the initial state of each field with useState
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'personal',
  });

  //updating a specific input based on the name
  const onChange = (e) => {
    console.log('onChange run!');
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    console.log(e.target);
    e.preventDefault();
    console.log('the value is', e.target.value);
    //if the current value is null which means we didn't click on edit we add a contact
    if (current === null) {
      addContact(contact);
    } else {
      console.log('got here');
      updateContact(contact);
    }
    //clear the current context obj wheter we add or update
    clearAll();
  };

  const clearAll = () => {
    clearCurrentContact();
  };

  const { name, email, phone, type } = contact;

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary">
        {current ? 'Edit Contact' : 'Add Contact'}
      </h2>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Phone"
        name="phone"
        value={phone}
        onChange={onChange}
      />
      <h5>Contact type</h5>
      <input
        type="radio"
        name="type"
        value="personal"
        onChange={onChange}
        checked={type === 'personal'}
      />{' '}
      Personal
      <input
        type="radio"
        name="type"
        value="professional"
        onChange={onChange}
        checked={type === 'professional'}
      />{' '}
      Professional
      <div>
        <input
          type="submit"
          value={current ? 'Update Contact' : 'Add Contact'}
          className="btn btn-primary btn-block"
        />
      </div>
      {current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;

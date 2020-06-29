import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ContactContext from './contactContext';
import contactRedcuer from './contactReducer';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
} from '../types';

//define the state
const ContactState = (props) => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: 'Mor',
        email: 'mor@gmail.com',
        phone: '111-111-111',
        type: 'professional',
      },
      {
        id: 2,
        name: 'Idan',
        email: 'idan@gmail.com',
        phone: '222-222-222',
        type: 'personal',
      },
      {
        id: 3,
        name: 'Afi',
        email: 'afi@gmail.com',
        phone: '333-333-333',
        type: 'professional',
      },
    ],
    current: null,
    filtered: null,
  };

  //state will give me access to the initial state obj
  //dispatch will allow me to dispatch actions to the reducer
  const [state, dispatch] = useReducer(contactRedcuer, initialState);

  //Add Contact
  const addContact = (contact) => {
    contact.id = uuidv4();
    dispatch({ type: ADD_CONTACT, payload: contact });
  };

  //Delete Contact
  const deleteContact = (id) => {
    console.log(id);
    dispatch({ type: DELETE_CONTACT, payload: id });
  };

  //Set Current Contact
  const setCurrentContact = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  //Clear Current Contact
  const clearCurrentContact = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  //Update Contact
  const updateContact = (updatedContact) => {
    console.log(updatedContact);
    dispatch({ type: UPDATE_CONTACT, payload: updatedContact });
  };

  //Filter  Contacts
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };

  //Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  //initalize provider
  return (
    <ContactContext.Provider
      //define which functions/state properties i want the provider to provide
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        addContact,
        deleteContact,
        setCurrentContact,
        clearCurrentContact,
        updateContact,
        filterContacts,
        clearFilter,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;

import React, { useContext, useRef, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactFilter = () => {
  const contactContext = useContext(ContactContext);
  const { filterContacts, clearFilter, filtered } = contactContext;

  useEffect(() => {
    //setting filtered to be null if there is nothing in the search input
    if (filtered === null) {
      text.current.value = '';
    }
  });

  //initalize ref value
  const text = useRef('');

  const onChange = (e) => {
    console.log(e.target.value);
    //getting the actual value of the input with the ref
    if (text.current.value !== '') {
      filterContacts(e.target.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input
        type="text"
        placeholder="Search contacts.."
        ref={text}
        onChange={onChange}
      />
    </form>
  );
};

export default ContactFilter;

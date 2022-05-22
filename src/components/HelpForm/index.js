import React, { useState } from 'react';
import { Web3Storage } from 'web3.storage';
import 'react-toggle/style.css';

import {
  Container,
  FormWrap,
  FormContent,
  Form,
  FormH1,
  FormLabel,
  FormInput,
  FormButton,
  FormSelect,
  FormArea,
} from './HelpFormElements';

import Toggle from 'react-toggle';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: '#171717',

    '&:focus': {
      outline: '1px solid #0dcaf4',
      border: 'none',
      backgroundColor: '#25262a',
    },
    '&:hover': {
      backgroundColor: '#171717',
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    marginTop: 0,

    backgroundColor: '#25262a',
    color: 'white',
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),

  menuItem: (base) => ({
    ...base,

    backgroundColor: '#25262a',
  }),
};

const HelpForm = ({ dappContract }) => {
  const [isInPerson, setIsInPerson] = useState(false);
  const [title, setTitle] = useState(false);
  const [description, setDescription] = useState(false);
  const [category, setCategory] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const storage = new Web3Storage({
        token: process.env.REACT_APP_WEB3_STORAGE,
      });

      const helpObject = {
        title: title,
        description: description,
        isOnline: !isInPerson,
        helpAdCategory: category.value,
      };

      const blob = new Blob([JSON.stringify(helpObject)], {
        type: 'application/json',
      });
      const file = new File([blob], 'helpPost.json');

      const cid = await storage.put([file], {
        onRootCidReady: (localCid) => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
          console.log('> 📡 sending files to web3.storage ');
        },
        onStoredChunk: (bytes) =>
          console.log(
            `> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`
          ),
      });

      const helpRequestLink = `${cid}.ipfs.dweb.link/helpPost.json`;

      const addRequest = await dappContract.addHelpAd(helpRequestLink);
      await addRequest.wait();
    } catch (error) {
      console.warn('Error: ', error);
    }
  };

  return (
    <Container>
      <FormWrap>
        <FormContent>
          <Form onSubmit={handleSubmit}>
            <FormH1>Create a Help Request</FormH1>
            <FormLabel htmlFor='for'>Category</FormLabel>
            <FormSelect
              defaultValue={options[0]}
              value={category}
              onChange={(category) => setCategory(category)}
              options={options}
              required
              styles={customStyles}
            />
            <FormLabel htmlFor='for'>Title</FormLabel>
            <FormInput
              type='text'
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <FormLabel htmlFor='for'>Description</FormLabel>
            <FormArea
              type='text'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />

            <FormLabel htmlFor='for'>
              Should This Help be Performed in Person?
            </FormLabel>
            <div style={{ marginBottom: '10px', marginTop: '10px' }}>
              <Toggle
                id='isInPerson'
                defaultChecked={isInPerson}
                onChange={() => setIsInPerson((prev) => !prev)}
              />
            </div>
            <FormButton type='submit'>Submit Request</FormButton>
          </Form>
        </FormContent>
      </FormWrap>
    </Container>
  );
};

export default HelpForm;
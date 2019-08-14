import { withAuthenticator } from 'aws-amplify-react';
import awsconfig from './aws-exports';
import Amplify from 'aws-amplify';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import TodoComponent from './TodoComponent';

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="container">
      <TodoComponent></TodoComponent>
    </div>
  );
}

export default withAuthenticator(App, {includeGreetings: true, usernameAttributes: 'email'});

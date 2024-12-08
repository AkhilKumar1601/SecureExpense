import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Import your AuthProvider context
import Router from './Router'; // Import the Router component

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router /> {/* Render the Router component which will handle routing */}
    </AuthProvider>
  );
};

export default App;

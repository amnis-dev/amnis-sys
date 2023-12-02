import React from 'react';
import { websiteAppCreate } from '@amnis/sys/web';
import { Navbar } from '@amnis/web';

const Website = websiteAppCreate({

});

export const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Website.Provider>
      <Navbar />
    </Website.Provider>
  );
};

export default App;

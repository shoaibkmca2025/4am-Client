
import React, { useEffect } from 'react';
import Contact from './Contact';

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 relative overflow-hidden bg-white dark:bg-brand-dark transition-colors duration-500">
      <Contact />
    </div>
  );
};

export default ContactPage;

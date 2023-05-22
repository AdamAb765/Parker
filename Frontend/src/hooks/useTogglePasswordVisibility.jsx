import React, { useState } from 'react';

export const useTogglePasswordVisibility = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [visibleIcon, setVisibleIcon] = useState('eye');
  
    const handlePasswordVisibility = () => {
      if (visibleIcon === 'eye') {
        setVisibleIcon('eye-off');
      } else if (visibleIcon === 'eye-off') {
        setVisibleIcon('eye');
      }
      setPasswordVisibility(!passwordVisibility);
    };
  
    return {
      passwordVisibility,
      visibleIcon,
      handlePasswordVisibility
    };
  };
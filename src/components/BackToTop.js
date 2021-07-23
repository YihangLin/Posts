import React, { useState } from 'react';

const BackToTop = () => {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 300) {
      setShowScroll(true);
    }

    if (showScroll && window.pageYOffset <= 300) {
      setShowScroll(false);
    }
  }

  const scrollTop = () => {
    window.scrollTo({top: 0, behavior:'smooth'});
  }

  window.addEventListener('scroll', checkScrollTop)
  return (
    <button className={showScroll ? 'back-to-top' : 'back-to-top-false'} onClick={scrollTop}>TOP</button>
  );
}
 
export default BackToTop;
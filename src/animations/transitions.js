/**
 * Animation configuration for page transitions and element animations
 */

// Common animation variants for staggered children
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Fade up animation for elements
  export const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  
  // Fade in animation for elements
  export const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };
  
  // Slide in from left animation
  export const slideInLeftVariant = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  
  // Slide in from right animation
  export const slideInRightVariant = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  
  // Staggered list item animation
  export const listItemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };
  
  // Zoom in animation
  export const zoomInVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };
  
  // Page transition animation
  export const pageTransition = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  /**
   * Apply staggered animation to a list of elements
   * @param {Array} items - The array of items
   * @param {Object} animation - Animation variant to use
   * @param {number} staggerDelay - Delay between each item animation
   * @returns {Array} - Array of elements with staggered animation props
   */
  export const staggeredAnimation = (items, animation, staggerDelay = 0.1) => {
    return items.map((item, index) => ({
      ...item,
      transition: {
        delay: index * staggerDelay,
        ...animation.transition
      }
    }));
  };
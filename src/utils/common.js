export const debounce = (func, wait = 250) => {
  let timerId;

  return function (...args) {
    const context = this;
    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

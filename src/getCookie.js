const getCookie = (key) => {
    const keyValue = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
    return keyValue ? keyValue.pop() : null;
  };

export {getCookie};
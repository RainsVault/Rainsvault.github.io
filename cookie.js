document.cookie.split(';').reduce((cookies, cookie) => {
  const [ name, value ] = cookie.split('=').map(c => c.trim());
  return { ...cookies, [name]: value };
}, {});

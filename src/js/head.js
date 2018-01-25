'use strict';

console.info('I\'mma be useful for polyfills and stuff');

const heyooo = async (url) => {
    const request = await fetch(url);
    const response = await request.json();

    console.log(response.data);
}

heyooo('https://reqres.in/api/users/1');

//import { response } from "express";

console.log('Hello World');

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL = 'http://localhost:5000/thoughts';
const thoughtsElement = document.querySelector('.thoughts');


    loadingElement.style.display = '';

listAllThoughts();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const thought = {
        name,
        content
    };
   
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(thought),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
      .then(createdthought => {
        form.reset();
        setTimeout(() => {
            form.style.display = '';

        },3000); //Form disappears for 3 seconds.
        listAllThoughts();
      });
});

function listAllThoughts(){
    thoughtsElement.innerHTML = '';
    fetch(API_URL)
        .then(res => res.json())
        .then(thoughts => {
            thoughts.reverse();
            thoughts.forEach(thought => {
                const div = document.createElement('div');
                
                const header = document.createElement('h3');
                header.textContent = thought.name;

                const contents = document.createElement('p');
                contents.textContent = thought.content;

                const date = document.createElement('small');
                date.textContent = new Date(thought.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                thoughtsElement.appendChild(div);

            });
            loadingElement.style.display = '';

        });

}
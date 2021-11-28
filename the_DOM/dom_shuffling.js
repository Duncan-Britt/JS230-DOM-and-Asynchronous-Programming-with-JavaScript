
const main = document.getElementsByTagName('main')[0];
const [ header2, header1 ] = document.getElementsByTagName('header');
document.body.insertBefore(header1, main);
header1.insertBefore(main.firstElementChild, header1.firstElementChild);

const [ fig2, fig1 ] = document.getElementsByTagName('figure');
const [ figCap1, figCap2 ] = document.getElementsByTagName('figcaption');
fig1.appendChild(figCap1);
fig2.appendChild(figCap2);

const article = document.getElementsByTagName('article')[0];
article.appendChild(fig1);
article.appendChild(fig2);

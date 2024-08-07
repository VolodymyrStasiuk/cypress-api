# API testing using Cypress
 **Start project**: \
 cd cypress-api \
 npx cypress open \
 **Implemented**: \
Mocking API, Headless Authorization, API Calls, env \

/cypress.env.json used to override cypress.config.json/env in case you want to use personal credentials etc. \
Another way to override cypress.config.json/env \
    cli> npx cypress open --env username=stas1@stas.stas,password \
using script in package.js \
    npm run cy:open_dev \

Reporting \

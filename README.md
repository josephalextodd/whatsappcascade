# whatsappcascade

A site to cascade Whatapp messages.

## config

In [www/app.js](www/app.js) there is the `HOSTMAP` that decides which domains/paths map onto which messages:

```javascript

// this maps the various urls and then pages onto what message we want to use
var HOSTMAP = {

  // the base url
  'insertyourdomainhere.co.uk': {
    '/': standardMessage(),
    '/otherpath': otherMessage()
  },

  // the default page - anything not found above will use this
  'default': {
    '/': standardMessage(),
    '/otherpath': otherMessage()
  }
}
```

The message function configures the text blocks of the message:

```javascript
function standardMessage(opts) {
  opts = opts || {}
  // the url is always passed in by the system
  return {
    main: function(forwardMessage, htmlMode) {
      return [
        "INSERT YOUR MESSAGE TEXT HERE. \n\n",
        "YOU CAN HAVE LINKS " + getLink('https://google.co.uk/', htmlMode) + " .\n\n",
        forwardMessage + "\n\n",
        "FORWARD MESSAGE IS INJETED"
      ].join('')
    },
    whatsapp: function(href) {
      // you must use href as it references itself
      return "Send this message as a whatsapp broadcast to your friends by clicking " + href + " and then choosing your contacts."
    },
    fallback: function(href) {
      return "Forward this page to your friends on social media."
    }
  }
}
```

## hosting

The site is static HTML - you must point any domains that you configure in `app.js` to the site.

## LICENCE

The use of this code is subject to prior verbal agreement from a staff member of Momentum, all of Walkden House, 10 Melton St, Kings Cross, London, NW1 2EB 
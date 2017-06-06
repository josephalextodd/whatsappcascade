function getLink(link, htmlMode) {
  return htmlMode ?
    '<a href="' + link + '" target="_blank">' + link + '</a>' :
    link
}


// a function that accepts some options to configure one overall message
// with some small variations
function standardMessage(opts) {
  opts = opts || {}
  // the url is always passed in by the system
  return {
    main: function(forwardMessage, htmlMode) {
      return [
        "INSERT YOUR MESSAGE TEXT HERE. \n\n",
        "YOU CAN HAVE LINKS " + getLink('https://google.co.uk/', htmlMode) + " .\n\n",
        forwardMessage + "\n\n",
        "FORWARD MESSAGE IS INJECTED"
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

// we can have multiple messages that can be used across various urls/pages
function otherMessage(opts) {
  opts = opts || {}
  return {
    main: function(forwardMessage, htmlMode) {
      return [
        "THIS IS ANOTHER MESSAGE \n\n",
        forwardMessage
      ].join('')
    },
    whatsapp: function(href) {
      return [
        "Click: " + href + " to open a pre-filled Whatsapp message including the text above.\n\n",
        "All you have to do is select the friends you'd like to send it to."
      ].join('')
    },
    fallback: function(href) {
      return "Forward this page to your friends on social media."
    }
  }
}

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

////////////////////////////////////////////////////////////////////////
// IGNORE BELOW THIS LINE

function getMessageFunctions(host, page) {
  var defaultSite = HOSTMAP.default
  var site = HOSTMAP[host] || defaultSite
  return site[page] || defaultSite[page] || defaultSite['/']
}

function getPageInfo() {
  var page = window.location.pathname
  var host = window.location.host
  var href = window.location.href
  return {
    host: host.replace(/^www\./, ''),
    page: page,
    href: href
  }
}

function getWhatsappURL(message) {
  return 'whatsapp://send?abid=BROADCAST_ID&text=' + encodeURIComponent(message)
}

function getWhatsappMessage(messageFunctions, href) {
  var forwardMessage = messageFunctions.whatsapp(href)
  return messageFunctions.main(forwardMessage)
}

function getFallbackMessage(messageFunctions, href) {
  var forwardMessage = messageFunctions.fallback(href)
  return messageFunctions.main(forwardMessage, true)
}

function setupPage() {
  var pageInfo = getPageInfo()
  var messageFunctions = getMessageFunctions(pageInfo.host, pageInfo.page)

  const whatsappMessage = getWhatsappMessage(messageFunctions, pageInfo.href)
  const fallbackMessage = getFallbackMessage(messageFunctions, pageInfo.href)

  var html = fallbackMessage.replace(/\n/g, '<br/>')
  var whatsappUrl = getWhatsappURL(whatsappMessage)

  $('#messageContent').html(html)
  document.location = whatsappUrl
}

$(function() {
  setupPage()
})

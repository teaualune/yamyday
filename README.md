# YaMyDay!
## Summary

**YaMyDay**, a "Yahoo news !" browser which following the top ten famous news *from your facebook friend!*

###Skill###
YaMyDay use Node.js base, which is a single page web app, and use Angular.js for frontend MVC structure.

To parsing Facebook and Web data, we frist use fbgraph for parsing facebook, which is a node.js server side library.

Using Python bottle as a parsing server, also implement BeatifulSoap for parsing Yahoo news! and other News web sties.

###Feature###
**Count the Post !**

Not only Yahoo News !, we parse all news on your facebook, and redirect to related Yahoo News ! page. We calculate the likes and sharing count for a post, that means how famous the post is.

With this fraction, we can give U the top ten News !

**Read all Share**

A famous news won't be lonely, it might be share or like many times. We collect them and Show all the share for U!

**Store the News!**

With a cute button, U can easily store the news in u're cupboard, check it all the times to review the famous news!

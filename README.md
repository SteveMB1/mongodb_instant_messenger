# NodeJS Instant Messenger (Inbox)

## ✨Features ✨
- Easily and quickly get started with adding instant messaging to your application.
- Everything is asynchronous, works with await.
- Small codebase with zero third-party dependencies (except mongodb)


## Requirements
- MongoDB
- Application logic that has a working and trusted authentication mechanism.

## Installation
Install and start the server.

```sh
npm install mongodb_instant_messenger
```

## Getting Started
```javascript
instant_messenger = require('mongodb_instant_messenger');
```

### Inbox
This will return an array of objects which is the user's inbox.
```javascript
await inbox(Readers_Profile_ID_From_Trusted_Authentication_Process);
```
Example of returned data. As you can see you get the makeup of an inbox. Inside your application you must include profile images and other useful information so the end user can understand who the message is coming from.

#### Inbox - Returned
```javascript
[
  {
    _id: new ObjectId("61c10a57108e95476ea51b70"),
    sender: new ObjectId("61c108d4108e95476ea51b6c"),
    content: 'test message 2',
    unread: true,
    timestamp: 2022-03-18T01:53:11.051Z
  },
  {
    _id: new ObjectId("61d8daca4b19c40ac4a0206a"),
    sender: new ObjectId("61c108d4108e95476ea51b6c"),
    content: 'test message 1',
    unread: false,
    timestamp: 2022-01-11T10:24:04.871Z
  }
]
```

### Send Message
```javascript
const messageID = await instant_messenger.sendMessage(message, Other_Users_ProfileID, Readers_Profile_ID_From_Trusted_Authentication_Process);
```

### Marking Messages from a Conversation as Read
```javascript
await instant_messenger.markRead(Other_Users_ProfileID, Readers_Profile_ID_From_Trusted_Authentication_Process);
```

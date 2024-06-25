# Connat

## About

Connat is an application that has modern and simple design while being feature-rich at the same time.

This application will have features below:

### Features

- [x] Live Chatting using SocketIO
- [ ] Anonymous Chatting
- [ ] Friend Management
- [ ] Group Chatting & Direct Messages
- [ ] PWA Implement
- [ ] API Support

### Dependancies

Check out [`package.json`](./package.json) for the list of dependancies.

### Branches

- `main`: Main development branch. Any change will be updated in this branch real-time.
- `bref`: Deprecated branch. Version of Connat before adoption of React.

### Testing

You can check out this app by running the server yourself. First of all, you'll need to make a `.env` file **at the root of the project directory**, which is for configuring the server. Here is the format:

```
SESSION_SECRET='foobar'
PORT=3000
```

After you've done that, you'll have to create a database and tables. To do that, you have to import the `source.sql` file. The `source.sql` file will create the database named `connat` by itself, so you won't have to make a new database before you import the file.

All you need to do now is just installing the dependancies, and you're good to go.
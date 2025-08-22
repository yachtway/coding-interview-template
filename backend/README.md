# Backend API Documentation

A NestJS-based backend API with real-time chat functionality using WebSockets and Prisma ORM for database management.

## Description

This backend provides a REST API for managing channels and messages, along with real-time chat functionality via WebSockets. Built with [NestJS](https://github.com/nestjs/nest) framework and TypeScript.

## Installation

```bash
$ npm install
```

## Database Setup

```bash
# Generate Prisma client
$ npx prisma generate
```

## Running the app

```bash
# development
$ npm run start:dev
```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### REST API

#### Channels
- **GET** `/channels`
  - **Description**: Get all channels with their most recent message
  - **Returns**: Array of Channel objects with additional fields:
    ```typescript
    {
      id: string;
      createdAt: Date;
      name: string;
      lastMessageSnippet: string;
      lastMessageCreatedAt: Date | string;
    }[]
    ```

#### Messages
- **GET** `/channels/:channelId/messages`
  - **Description**: Get all messages for a specific channel
  - **Parameters**:
    - `channelId` (string): The ID of the channel
  - **Returns**: Array of Message objects:
    ```typescript
    {
      id: string;
      createdAt: Date;
      content: string;
      senderName: string | null;
      channelId: string;
    }[]
    ```
  - **Ordering**: Messages are returned in ascending order by creation date

## WebSocket API

### Connection
- **URL**: `ws://localhost:3001/chat`

### Events

#### Client to Server Events

##### `message`
Send a new message to a channel.

**Payload**:
```typescript
{
  content: string;        // Required: The message content
  channelId: string;      // Required: The target channel ID
  senderName?: string;    // Optional: Sender name (defaults to "Anon")
}
```

**Behavior**:
- Message is broadcast to all connected clients
- Message is saved to the database

#### Server to Client Events

##### `message`
Broadcast when a new message is received.

**Payload**:
```typescript
{
  content: string;
  channelId: string;
  senderName: string;
}
```

### Connection Events
- **Connection**: Logged with client ID and total connected clients count
- **Disconnection**: Logged with client ID
# Instructions

* You should aim to spend between 3 to 4 hours on the exercise
* Return the solution or make it available to us upon completion
* Please do not mention BeamTrail in your solution or repository name

## Minimum Technical Requirements

The solution should as a minimum be defined using:

* TypeScript
* ReactJS

## Task

Your task is to create a front-end UI displaying various Internet of Things (IoT) sensors based on data provided through a Web Socket endpoint.

The UI should be showing the sensors with their current state and the end-user should be able to connect and disconnect the sensors. There should also be a possibility to toggle whether to see all sensors or only the connected sensors.

Layout, colors, fonts and other styling is up to you to make sure the UI is as appealing and useable as possible.

## Web Socket Server

You are provided with a tiny backend server exposing Web Socket endpoint on <http://localhost:5000>.

From the `/server` directory in your terminal or IDE run the following command:

```bash
npm install && npm start
```

### API

On the client connection event, the API will stream back to the current state of the application in the format:

```typescript
{ 
    id: string; 
    name: string; 
    connected: boolean; 
    unit: string; 
    value: string 
} 
```

The Web Socket endpoint accepts the following messages, where `id` is the sensor identifier:

```typescript
// Connect Sensor
{ command: "connect"; id: string }

// Disconnect Sensor
{ command: "disconnect"; id: string }
```

## Questions

* What aspect of this exercise did you find most interesting?
* What did you find most cumbersome to do?
* How can we further improve the user experience?

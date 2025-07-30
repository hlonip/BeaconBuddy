

# BeaconBuddy

BeaconBuddy is a real-time location sharing application designed to help you get found when you're lost. It provides your precise GPS coordinates, generates an AI-powered description of your surroundings, and allows you to share your location with friends or family through a unique 

## Features

- **Real-Time Geolocation:** Get your current location using your device's GPS.
- **AI-Powered Surroundings Description:** Uses generative AI to describe your current location, helping you orient yourself and identify landmarks.
- **Text-to-Speech Audio:** Converts the AI-generated description into an audio clip that you can listen to.
- **Location Link Sharing:** Generate a unique URL that you can send to anyone, allowing them to see your location on a map.
- **WhatsApp Integration:** Share your location description, a map link, and the audio description directly via WhatsApp with a pre-formatted message.
- **Friend View:** The shared link opens a dedicated page showing the friend's location on a map.
- **Responsive Design:** A clean, modern interface that works on both desktop and mobile devices.
- **Light & Dark Mode:** Switch between light and dark themes for your preference.

## Tech Stack

This project is built with a modern web development stack:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Google AI Studio (Genkit)](https://firebase.google.com/docs/genkit)
- **Maps:** [Google Maps Platform](https://mapsplatform.google.com/)
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/)

### Environment Variables

You'll need to set up environment variables for the application to work correctly. Create a file named `.env.local` in the root of your project and add the following variables:

```
# Used for Google Maps Platform to display the map.
# Get a key from the Google Cloud Console.
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# Used for Google AI (Genkit) to generate descriptions.
# Get a key from Google AI Studio.
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

**Important:** Make sure the **Maps JavaScript API** and the **Generative Language API** are enabled in your Google Cloud project.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/your_repository.git
   ```
2. Navigate to the project directory
   ```sh
   cd your_repository
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

### Running the Application

1. **Start the Genkit development server:**
   This runs the AI flows that power the location description and text-to-speech features.
   ```sh
   npm run genkit:dev
   ```

2. **In a separate terminal, start the Next.js development server:**
   ```sh
   npm run dev
   ```

3. Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## How It Works

1.  The user opens the application and grants location permissions.
2.  The app gets the user's latitude and longitude.
3.  The user can click "Describe My Surroundings."
4.  A Genkit flow is triggered, sending the coordinates to a Gemini model to generate a text description.
5.  Another Genkit flow uses a text-to-speech model to create an audio version of the description.
6.  The user can play the audio or share the description, audio, and a unique location link via WhatsApp or other services.
7.  A friend receiving the link can open it to see the user's location on a Google Map.

## Video

https://www.youtube.com/shorts/XSFv35MJN3https://www.youtube.com/shorts/XSFv35MJN3Q
<img width="960" height="540" alt="one" src="https://github.com/user-attachments/assets/c858d3f7-450e-4d41-98d2-c7e5e19384c2" />

![Screenshot_20250730_185801_Video Player](https://github.com/user-attachments/assets/a737d0ab-67de-4136-be4c-5cea91803f68)
![Screenshot_20250730_185642_Gallery](https://github.com/user-attachments/assets/806f1a3d-7069-4f0c-86a0-524a626df935)

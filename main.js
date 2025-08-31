// Import the SDK
import { DiscordSDK } from "@discord/embedded-app-sdk";

import "./style.css";
import web4logo from '/web4.png.jpg';

// Instantiate the SDK
const discordSdk = new DiscordSDK(import.meta.env.1169709827145089064);

setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

async function setupDiscordSdk() {
  await discordSdk.ready();
}

document.querySelector('#app').innerHTML = `
  <div>
    <img src="${web4logo}" class="logo" alt="web4" />
    <h1>Hello, World!</h1>
  </div>
`;

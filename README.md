# Blockchain Indexing Platform on Helius

https://earn.superteam.fun/listing/build-a-blockchain-indexing-platform-on-helius/

## Example Use Case

We have created a simple use case for the Helius Indexer. We will be tracking a normal TRANSFER in this case via Helius Webhooks.

1. When you open the frontend, you will see a signup page. You can enter your email and password to create an account. If already have an account, you can login.

![signup](/images/signup.png)

2. Once you have created an account, you will be redirected to the dashboard. Here you can add the database and subscriptions.

![dashboard](/images/dashboard-initial.png)

3. Firstly, run the command shown on screen in your database. It creates an Indexer table which would store the txns sent by Helius. You can add the database by entering the URL of your Postgres database. I have added my `neon.tech` database in the example below.

![database](/images/dashboard-after-db.png)

4. Once you have added the database, you can add the subscriptions.

5. You can add the subscriptions by entering the transaction types and the wallet addresses that you want to track. Currently we have three predefined transactions that you can track - TRANSFER, NFT_BID and NFT_SALE. I added `TRANSFER` on `Htg9cXNdSrP37Q1ZJqsewMoMTdBfkrRHYYm3F1EJj5Uk` address.

![subscription](/images/add-transfer-subscription.png)

6. Once you have added the subscriptions, any transactions that match the transaction types and wallet addresses will be indexed and stored in your database.

7. Here is the wallet on devnet with some SOL. I have initiated a transaction of 0.1 SOL from subscribed wallet.

<img src="/images/backpack-wallet.png" width="300" alt="backpack-wallet">

![transfer-sol](/images/transfer-sol.png)

Solana Explorer shows the transaction. https://explorer.solana.com/tx/r5ytE3KrfFJWDRz74VypQeFZ2oSon9Rb6qhukfetDuhxUdnVLR8iNNqCuzoiqPoPrCEzJ3Ve7uFn4ktWfD4SCz1?cluster=devnet

8. You can view the indexed transactions in your database.

![neon-tech](/images/neon-tech-dashboard.png)

9. You can also view the logs of the websocket server to see the realtime updates.

![real-time](/images/transfer-real-time.png)

## Setup and Installation

We need to run the following services:

- Database

```
cd docker
cp .env.example .env
docker-compose up -d
```

Database will be running on [http://localhost:6000](http://localhost:6000)

- Backend

```
cd backend
cp .env.example .env
npm i
cd prisma
npx prisma migrate dev    // setup db
npm run dev
```

Backend will be running on [http://localhost:5000](http://localhost:5000)

- Frontend

```
cd frontend
npm i
npm run dev
```

Frontend will be running on [http://localhost:5173](http://localhost:5173)

- Websocket Server (for realtime updates)

```
cd ws-server
npm i
npm run dev
```

Websocket Server will be running on [ws://localhost:8080](ws://localhost:8080)

- For the indexer - we have used this MadLads NFT as an example - [MadLads NFT](https://solscan.io/token/B4KqwNKWSxXUNyJpG1N963z7u3svPtKCFy3bN38qTabB). Add the subscription type as `NFT_SALE` and the wallet address as `B4KqwNKWSxXUNyJpG1N963z7u3svPtKCFy3bN38qTabB`. Any NFT sale transactions will be indexed and stored in your database.

![nft-image](/images/mad-lads-nft.png)

## Setup Helius Webhooks - Index Solana Blockchain

Create your own webhook to tap into Solana events and send them to your applications, either parsed or in raw formats.

### Overview

- Create an ngrok account (https://ngrok.com/)
- Create an account on Helius (https://www.helius.dev) in order to push data to the webhook you'll create
- Create a simple nodejs with the default POST / endpoint as the webhook.

### Step 1 - Setup an ngrok account

Because we'll be running our webhook locally (localhost:8787/), we need a way to tell Helius how to send a request to our localhost. There are several ways to do this, but the easiest is to use ngrok (https://ngrok.com/). Sign up is free. Once you do that, you can download ngrok to your machine (Windows, MacOS, Linux). Once that is installed you can check to see if it's working:

     ngrok -v

If that successfully prints the version you installed then you can run:

    ngrok http <port>

After executing that command you should see something like this:

    Forwarding      https://9add-49-43-98-101.ngrok-free.app -> http://localhost:<port>

This means, you can now use "https://9add-49-43-98-101.ngrok-free.app" and a public facing URL that will forward to your localhost. This URL is what we'll use to configure Helius.

### Step 2 - Webhook (Hono - Cloudflare Workers / Nodejs)

You can either use cloudflare workers or nodejs. We'll be using nodejs in this example.

Create a basic nodejs app with express following this guide - [Getting Started - Express](https://expressjs.com/en/starter/hello-world.html)

We have provided a sample express app in the backend folder.
if you have already ran the backend, skip to step 3.
To run the app -

```
cd backend
cp .env.example .env
npm i
cd prisma
npx prisma migrate dev    // setup db
npm run dev
```

App will be running on [http://localhost:5000](http://localhost:5000)

### Step 3 - Helius

If you don't already have a Helius (https://www.helius.dev) account, you can create one for free. It will generate a project name for you and ask you to generate a new API key. Click the button and it will generate a new key and forward you to your new dashboard. You'll see two a devnet and mainnet URL that you can use for Solana RPC endpoints, but what we are interested in is the webhook functionality. Let's click on the webhook link in the navigation menu.

Click the "New Webhook" button.
Add the desired transaction types and wallet addresses that you need to index.
If you only want to track transfers - there is a TRANSFER type in the Enhanced Webhook Transactions.
Checkout the exact formats in transaction json files in the root directory.
Now we'll configure the webhook using the URL that ngrok provided: [https://9add-49-43-98-101.ngrok-free.app](https://https://9add-49-43-98-101.ngrok-free.app/)

Update the webhook url in helius with your ngrok url.
**Make sure to not add the / at the end of the url.**
You can now start requesting data from Helius for your use cases.

![helius-dashboard](/images/helius-dashboard.png)
![helius-webhook-example](/images/helius-webhook-example.png)

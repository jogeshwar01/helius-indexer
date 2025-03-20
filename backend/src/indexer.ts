import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";
import { WS_SERVER_URL } from "./constants";
const prisma = new PrismaClient();

export interface Transaction {
  type: string;
  accountData: any;
  [key: string]: any;
}

export interface IndexerResponse {
  status: number;
  body: any;
}

export const handleIndexerRequest = async (
  transaction: Transaction[],
  headers: any
): Promise<IndexerResponse> => {
  try {
    // Check Authorization Token
    if (headers.authorization !== process.env.HELIUS_AUTH_TOKEN) {
      return {
        status: 401,
        body: { error: "Unauthorized" },
      };
    }

    // Loop through the transaction and check for subscriptions
    for (const event of transaction) {
      const { type, accountData, signature } = event;

      // Check for matching subscriptions
      const subscriptions = await prisma.subscription.findMany({
        where: {
          subType: type,
          subAddress: {
            in: accountData.map((data: any) => data.account),
          },
        },
      });

      for (const subscription of subscriptions) {
        // Fetch the user's database credentials
        const userDbCreds = await prisma.databaseCreds.findUnique({
          where: {
            userId: subscription.userId,
          },
        });

        if (userDbCreds) {
          // Create new PrismaClient instance with user's database URL
          const userPrisma = new PrismaClient({
            datasources: {
              db: {
                url: userDbCreds.dbUrl,
              },
            },
            transactionOptions: {
              timeout: 5000,
            },
          });

          try {
            await userPrisma.indexer.create({
              data: {
                id: uuidv4(),
                transaction: event,
                subscriptionType: subscription.subType,
                subscriptionAddress: subscription.subAddress,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });

            // Connect to WebSocket server and send the transaction
            const ws = new WebSocket(WS_SERVER_URL);
            const user_id = subscription.userId;
            const sub_type = subscription.subType;
            const sub_address = subscription.subAddress;

            ws.on("open", () => {
              ws.send(
                JSON.stringify({ user_id, sub_type, sub_address, signature })
              );
              ws.close();
            });
          } catch (error) {
            console.error(
              "Error inserting transaction into user's database:",
              error
            );
          } finally {
            await userPrisma.$disconnect();
          }
        }
      }
    }

    // Store the transaction in your Prisma database
    await prisma.indexer.create({
      data: { transaction: transaction },
    });

    return {
      status: 200,
      body: { message: "Data Indexed successfully" },
    };
  } catch (error) {
    console.error("Indexer error:", error);
    return {
      status: 500,
      body: { error: "Internal server error" },
    };
  }
};

import { PrismaClient } from "@prisma/client";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";
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
      const { type, accountData } = event;

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
          // Connect to the user's database using the credentials
          const client = new Client({
            connectionString: userDbCreds.dbUrl,
          });

          try {
            const queryText = `
              INSERT INTO "Indexer" (
                "id", "subscriptionType", "subscriptionAddress", "transaction", "createdAt", "updatedAt"
              ) VALUES ($1, $2, $3, $4, $5, $6)
            `;
            const queryValues = [
              uuidv4(),
              subscription.subType,
              subscription.subAddress,
              JSON.stringify(event),
              new Date().toISOString(),
              new Date().toISOString(),
            ];

            await client.query(queryText, queryValues);
            console.log(
              `Transaction inserted into Indexer for user ${subscription.userId}`
            );
          } catch (error) {
            console.error(
              "Error inserting transaction into user's database:",
              error
            );
          } finally {
            await client.end();
          }
        }
      }
    }

    // Store the transaction in your Prisma database
    await prisma.indexer.create({
      data: { transaction: JSON.stringify(transaction) },
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

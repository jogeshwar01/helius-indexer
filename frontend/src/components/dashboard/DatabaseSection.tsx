interface DatabaseSectionProps {
  databaseInput: string;
  setDatabaseInput: (value: string) => void;
  handleAddDatabase: () => void;
}

const DatabaseSection = ({
  databaseInput,
  setDatabaseInput,
  handleAddDatabase,
}: DatabaseSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="bg-gray-700 p-4 rounded-md">
          <p className="text-gray-200 text-sm mb-2">
            Before connecting your database, please ensure you have created the
            following table:
          </p>
          <pre className="bg-gray-800 p-3 rounded text-xs text-gray-300 overflow-x-auto">
            {`CREATE TABLE "Indexer" (
    "id" TEXT NOT NULL,
    "subscriptionType" TEXT NOT NULL, 
    "subscriptionAddress" TEXT NOT NULL,
    "transaction" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Indexer_pkey" PRIMARY KEY ("id")
);`}
          </pre>
        </div>
        <input
          type="text"
          placeholder="Database URL"
          value={databaseInput}
          onChange={(e) => setDatabaseInput(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-100 placeholder-gray-400"
        />
        <button
          onClick={handleAddDatabase}
          className="px-4 py-2 cursor-pointer hover:underline bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Database
        </button>
      </div>
    </div>
  );
};

export default DatabaseSection;

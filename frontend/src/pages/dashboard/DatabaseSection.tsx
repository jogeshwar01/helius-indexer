interface DatabaseSectionProps {
  databaseInput: string;
  setDatabaseInput: (value: string) => void;
  handleAddDatabase: () => void;
  error: string;
}

const DatabaseSection = ({
  databaseInput,
  setDatabaseInput,
  handleAddDatabase,
  error,
}: DatabaseSectionProps) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Database URL"
        value={databaseInput}
        onChange={(e) => setDatabaseInput(e.target.value)}
      />
      <button onClick={handleAddDatabase}>Add Database</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default DatabaseSection;

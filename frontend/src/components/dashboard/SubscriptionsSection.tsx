import { useEffect, useState } from "react";
import { SUBSCRIPTION_TYPES, WS_SERVER_URL } from "../../constants";

export interface Subscription {
  subType: string;
  subAddress: string;
}

interface SubscriptionsSectionProps {
  database: string;
  subscriptions: Subscription[];
  subscriptionInput: Subscription | null;
  setSubscriptionInput: (subscription: Subscription | null) => void;
  handleAddSubscription: () => void;
}

const SubscriptionsSection = ({
  database,
  subscriptions,
  subscriptionInput,
  setSubscriptionInput,
  handleAddSubscription,
}: SubscriptionsSectionProps) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = new WebSocket(WS_SERVER_URL);
    newSocket.onopen = () => {
      setLogs((prev) => [...prev, "> Waiting for transactions..."]);
    };
    newSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.user_id === localStorage.getItem("user_id")) {
        delete data.user_id;
        setLogs((prev) => [
          ...prev,
          ``,
          `-----`,
          `> Transaction Details:`,
          `- Type: ${data.sub_type}`,
          `- Address: ${data.sub_address}`,
          `- Signature: ${data.signature}`,
          `-----`,
        ]);
      }
    };
    return () => newSocket.close();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-100">Database</h3>
        <p className="mt-1 text-sm text-gray-400">{database}</p>
      </div>

      {subscriptions.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-100 mb-3">
            Subscriptions
          </h4>
          <div className="space-y-2">
            {subscriptions.map((sub: Subscription) => (
              <div key={sub.subType} className="p-3 bg-gray-800 rounded-md">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">{sub.subType}</span> -{" "}
                  {sub.subAddress}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <select
          onChange={(e) => {
            const selected = SUBSCRIPTION_TYPES.find(
              (s) => s.subType === e.target.value
            );
            if (selected) {
              setSubscriptionInput({
                subType: selected.subType,
                subAddress: selected.address,
              });
            }
          }}
          className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100"
        >
          <option value="">Select subscription type</option>
          {SUBSCRIPTION_TYPES.filter(
            (subType) =>
              !subscriptions?.some(
                (sub: Subscription) =>
                  sub.subType === subType.subType &&
                  sub.subAddress === subType.address
              )
          ).map((subType) => (
            <option key={subType.subType} value={subType.subType}>
              {subType.subType} - {subType.address}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddSubscription}
          disabled={!subscriptionInput}
          className="w-full px-4 py-2 text-sm cursor-pointer hover:underline font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Subscription
        </button>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-100 mb-3">
          Transaction Logs
        </h4>
        <div className="bg-black rounded-md p-4 min-h-64 max-h-[1000px] overflow-y-auto font-mono text-sm text-nowrap">
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index + log} className="text-green-400">
                {log}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500">Waiting for transactions...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsSection;

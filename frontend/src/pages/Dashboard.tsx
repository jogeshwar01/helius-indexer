import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_TYPES, API_BASE_URL } from "../constants";

const Dashboard = () => {
  const [databaseInput, setDatabaseInput] = useState<string>("");
  const [database, setDatabase] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [subscriptionInput, setSubscriptionInput] = useState<{
    subType: string;
    subAddress: string;
  } | null>(null);
  const [subscriptions, setSubscriptions] = useState<
    {
      subType: string;
      subAddress: string;
    }[]
  >([]);

  const navigate = useNavigate();
  const fetchSubscriptions = async () => {
    const response = await axios.get(`${API_BASE_URL}/core/get_subscriptions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 200) {
      setSubscriptions(response?.data?.subscriptions);
    }
  };

  useEffect(() => {
    const fetchDatabase = async () => {
      const response = await axios.get(`${API_BASE_URL}/core/get_database`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setDatabase(response?.data?.database?.dbUrl);
        fetchSubscriptions();
      }
    };
    fetchDatabase();
  }, []);

  const handleAddDatabase = async () => {
    const response = await axios.post(
      `${API_BASE_URL}/core/add_database`,
      {
        dbUrl: "Dsadsads",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setDatabase(response?.data?.database?.dbUrl);
    }

    if (response.status === 401) {
      setError(response.data.error);
    }
  };

  const handleAddSubscription = async () => {
    const response = await axios.post(
      `${API_BASE_URL}/core/add_subscription`,
      {
        subscriptionType: subscriptionInput?.subType,
        subscriptionAddress: subscriptionInput?.subAddress,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setSubscriptionInput(null);
      fetchSubscriptions();
    }

    if (response.status === 401) {
      setError(response.data.error);
    }
  };

  if (!localStorage.getItem("token")) {
    navigate("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>User: {localStorage.getItem("email")}</h2>
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>

      {database ? (
        <div>
          <h3>Database: {database}</h3>
          {subscriptions.length > 0 && (
            <div>
              <h4>Subscriptions</h4>
              {subscriptions.map((sub) => (
                <p key={sub.subType}>
                  {sub.subType} - {sub.subAddress}
                </p>
              ))}
            </div>
          )}

          <select
            onChange={(e) => {
              const selected = SUBSCRIPTION_TYPES.find(
                (s) => s.subType === e.target.value
              );
              if (selected) {
                setSubscriptionInput({
                  subType: selected.subType,
                  subAddress: selected.address, // Use the address from SUBSCRIPTION_TYPES
                });
              }
            }}
          >
            <option value="">Select subscription type</option>
            {SUBSCRIPTION_TYPES.filter(
              (subType) =>
                !subscriptions?.some(
                  (sub) =>
                    sub.subType === subType.subType &&
                    sub.subAddress === subType.address
                )
            ).map((subType) => (
              <option key={subType.subType} value={subType.subType}>
                {subType.subType} - {subType.address}
              </option>
            ))}
          </select>
          <button onClick={handleAddSubscription} disabled={!subscriptionInput}>
            Add Subscription
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Dashboard;

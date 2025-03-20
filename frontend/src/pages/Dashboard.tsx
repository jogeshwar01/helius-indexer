import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import DatabaseSection from "./dashboard/DatabaseSection";
import SubscriptionsSection, {
  Subscription,
} from "./dashboard/SubscriptionsSection";

const Dashboard = () => {
  const [databaseInput, setDatabaseInput] = useState<string>("");
  const [database, setDatabase] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [subscriptionInput, setSubscriptionInput] =
    useState<Subscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

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
        <SubscriptionsSection
          database={database}
          subscriptions={subscriptions}
          subscriptionInput={subscriptionInput}
          setSubscriptionInput={setSubscriptionInput}
          handleAddSubscription={handleAddSubscription}
        />
      ) : (
        <DatabaseSection
          databaseInput={databaseInput}
          setDatabaseInput={setDatabaseInput}
          handleAddDatabase={handleAddDatabase}
          error={error}
        />
      )}
    </div>
  );
};

export default Dashboard;

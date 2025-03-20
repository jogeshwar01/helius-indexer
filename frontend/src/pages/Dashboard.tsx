import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import DatabaseSection from "../components/dashboard/DatabaseSection";
import SubscriptionsSection, {
  Subscription,
} from "../components/dashboard/SubscriptionsSection";
import Logo from "../components/Logo";

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
        dbUrl: databaseInput,
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
      fetchSubscriptions();
    }

    if (response.status === 401) {
      setError(response.data.error);
    }

    setSubscriptionInput(null);
  };

  if (!localStorage.getItem("token")) {
    navigate("/login");
  }

  return (
    <>
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center">
        <div className="w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
              <p className="text-gray-400 mt-1">
                {localStorage.getItem("email")}
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="px-4 py-2 cursor-pointer hover:underline bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;

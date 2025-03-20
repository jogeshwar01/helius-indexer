import { SUBSCRIPTION_TYPES } from "../../constants";

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
  return (
    <div>
      <h3>Database: {database}</h3>
      {subscriptions.length > 0 && (
        <div>
          <h4>Subscriptions</h4>
          {subscriptions.map((sub: Subscription) => (
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
              subAddress: selected.address,
            });
          }
        }}
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
      <button onClick={handleAddSubscription} disabled={!subscriptionInput}>
        Add Subscription
      </button>
    </div>
  );
};

export default SubscriptionsSection;

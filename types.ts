export interface SignUpFormProps{
    id?: string;
    name: string;
    email: string;
    password: string

}

export interface LoginProps {
    email: string;
    password: string;
}

export type BalanceLine = {
    name: string;
    groupName: string;
    amount: string;
    positive: boolean
}

export interface DashboardGroup {
  id: string;
  name: string;
  subtitle: string;
  total: string;
  balance: string;
  status: "owed" | "owe" | "settled";
  members: { id: string; name: string; initials: string; isAdmin: boolean; email: string }[];
  expenses: { id: string; title: string; paid: string; amount: string; date: string }[];
};
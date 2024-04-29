import { getUserOrRedirect } from "@/utils/common";
import React from "react";

type Props = {};

const Dashboard = async (props: Props) => {
  const user = await getUserOrRedirect();
  return <div>Dashboard</div>;
};

export default Dashboard;

"use client";
import { UserSettings } from "@prisma/client";
import React from "react";

type Props = {
  userSettings: UserSettings;
};

const History = ({ userSettings }: Props) => {
  return <div>History</div>;
};

export default History;

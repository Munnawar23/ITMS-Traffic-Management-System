export const loginApi = async (data: any) => {
  // Static logic for testing as requested
  if (
    (data.phone_number === "9999999999" && data.password === "password123") ||
    data.passpin === "12345"
  ) {
    return { access_token: "mock_token_12345" };
  }

  const error = new Error("Invalid credentials") as any;
  error.response = {
    data: { message: "Invalid phone number, password or PIN" },
  };
  throw error;
};

export const getProfileApi = async () => {
  return {
    id: 1,
    name: "Jawan",
    role: "Jawan",
    badgeNumber: "TP-9988",
  };
};

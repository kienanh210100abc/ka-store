const BASE_URL = "https://693a6dea9b80ba7262c9e0fe.mockapi.io";

export const fetchRestaurantData = async () => {
  const response = await fetch(`${BASE_URL}/restaurant`);
  if (!response.ok) {
    throw new Error("Failed to fetch restaurant data");
  }
  return response.json();
};

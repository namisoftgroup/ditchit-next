export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const SORT_BY = [
  {
    name: "Best",
    value: "best",
  },
  {
    name: "Latest",
    value: "latest",
  },
  {
    name: "Lowest Price",
    value: "lowest",
  },
  {
    name: "Highest Price",
    value: "highest",
  },
  {
    name: "Near By",
    value: "near",
  },
];

export const CONDITIONS = [
  {
    name: "New",
    value: "new",
  },
  {
    name: "Used",
    value: "used",
  },
];

export const SHIPPING_METHODS = [
  {
    name: "Local + Shipping",
    value: "both",
  },
  {
    name: "Local",
    value: "local",
  },
  {
    name: "Shipping",
    value: "shipping",
  },
];

export const POST_TABS = [
  "Choose Category",
  "Main Details",
  "More Details",
  "Price & Shipping",
];

export const SOCKET_EVENTS = {
  JOIN_USER: "ditch_it_user_join",

  JOIN_ROOMS: "ditch_it_join_rooms",
  LEAVE_ROOMS: "ditch_it_leaves_rooms",

  SEND_FIRST_MESSAGE: "ditch_it_one_user_send_data",
  RECEIVE_FIRST_MESSAGE: "ditch_it_one_user_receive_data",

  SEND_MESSAGE: "ditch_it_one_room_send_data",
  RECEIVE_MESSAGE: "ditch_it_one_room_receive_data",
};

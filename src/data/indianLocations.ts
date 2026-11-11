export interface CityLocation {
  name: string;
  lat: number;
  lng: number;
  pincodePrefix: string;
}

export interface StateInfo {
  name: string;
  cities: CityLocation[];
}

export const INDIAN_STATES: StateInfo[] = [
  {
    name: "Maharashtra",
    cities: [
      { name: "Mumbai", lat: 18.9388, lng: 72.8354, pincodePrefix: "400" },
      { name: "Pune", lat: 18.5204, lng: 73.8567, pincodePrefix: "411" },
      { name: "Nagpur", lat: 21.1458, lng: 79.0882, pincodePrefix: "440" },
      { name: "Nashik", lat: 19.9975, lng: 73.7898, pincodePrefix: "422" },
      { name: "Aurangabad", lat: 19.8762, lng: 75.3433, pincodePrefix: "431" }
    ]
  },
  {
    name: "Delhi",
    cities: [
      { name: "Delhi", lat: 28.6139, lng: 77.2090, pincodePrefix: "110" },
      { name: "New Delhi", lat: 28.6139, lng: 77.2090, pincodePrefix: "110" },
      { name: "Dwarka", lat: 28.5823, lng: 77.0500, pincodePrefix: "110" },
      { name: "Saket", lat: 28.5244, lng: 77.2066, pincodePrefix: "110" }
    ]
  },
  {
    name: "Karnataka",
    cities: [
      { name: "Bengaluru", lat: 12.9716, lng: 77.5946, pincodePrefix: "560" },
      { name: "Mysuru", lat: 12.2958, lng: 76.6394, pincodePrefix: "570" },
      { name: "Mangaluru", lat: 12.9141, lng: 74.8560, pincodePrefix: "575" },
      { name: "Hubballi", lat: 15.3647, lng: 75.1240, pincodePrefix: "580" }
    ]
  },
  {
    name: "Tamil Nadu",
    cities: [
      { name: "Chennai", lat: 13.0827, lng: 80.2707, pincodePrefix: "600" },
      { name: "Coimbatore", lat: 11.0168, lng: 76.9558, pincodePrefix: "641" },
      { name: "Madurai", lat: 9.9252, lng: 78.1198, pincodePrefix: "625" },
      { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, pincodePrefix: "620" }
    ]
  },
  {
    name: "Gujarat",
    cities: [
      { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, pincodePrefix: "380" },
      { name: "Surat", lat: 21.1702, lng: 72.8311, pincodePrefix: "395" },
      { name: "Vadodara", lat: 22.3072, lng: 73.1812, pincodePrefix: "390" },
      { name: "Rajkot", lat: 22.3039, lng: 70.8022, pincodePrefix: "360" }
    ]
  },
  {
    name: "Rajasthan",
    cities: [
      { name: "Jaipur", lat: 26.9124, lng: 75.7873, pincodePrefix: "302" },
      { name: "Udaipur", lat: 24.5854, lng: 73.7125, pincodePrefix: "313" },
      { name: "Bhilwara", lat: 25.3463, lng: 74.6369, pincodePrefix: "311" },
      { name: "Jodhpur", lat: 26.2389, lng: 73.0243, pincodePrefix: "342" },
      { name: "Kota", lat: 25.2138, lng: 75.8648, pincodePrefix: "324" }
    ]
  },
  {
    name: "West Bengal",
    cities: [
      { name: "Kolkata", lat: 22.5726, lng: 88.3639, pincodePrefix: "700" },
      { name: "Howrah", lat: 22.5958, lng: 88.2636, pincodePrefix: "711" },
      { name: "Siliguri", lat: 26.7271, lng: 88.3953, pincodePrefix: "734" },
      { name: "Durgapur", lat: 23.5204, lng: 87.3119, pincodePrefix: "713" }
    ]
  },
  {
    name: "Telangana",
    cities: [
      { name: "Hyderabad", lat: 17.3850, lng: 78.4867, pincodePrefix: "500" },
      { name: "Warangal", lat: 17.9689, lng: 79.5941, pincodePrefix: "506" },
      { name: "Nizamabad", lat: 18.6725, lng: 78.0941, pincodePrefix: "503" }
    ]
  },
  {
    name: "Uttar Pradesh",
    cities: [
      { name: "Lucknow", lat: 26.8467, lng: 80.9462, pincodePrefix: "226" },
      { name: "Kanpur", lat: 26.4499, lng: 80.3319, pincodePrefix: "208" },
      { name: "Varanasi", lat: 25.3176, lng: 82.9739, pincodePrefix: "221" },
      { name: "Noida", lat: 28.5355, lng: 77.3910, pincodePrefix: "201" },
      { name: "Agra", lat: 27.1767, lng: 78.0081, pincodePrefix: "282" }
    ]
  },
  {
    name: "Madhya Pradesh",
    cities: [
      { name: "Indore", lat: 22.7196, lng: 75.8577, pincodePrefix: "452" },
      { name: "Bhopal", lat: 23.2599, lng: 77.4126, pincodePrefix: "462" },
      { name: "Gwalior", lat: 26.2183, lng: 78.1828, pincodePrefix: "474" },
      { name: "Jabalpur", lat: 23.1815, lng: 79.9864, pincodePrefix: "482" }
    ]
  },
  {
    name: "Kerala",
    cities: [
      { name: "Kochi", lat: 9.9312, lng: 76.2673, pincodePrefix: "682" },
      { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, pincodePrefix: "695" },
      { name: "Kozhikode", lat: 11.2588, lng: 75.7804, pincodePrefix: "673" }
    ]
  },
  {
    name: "Punjab",
    cities: [
      { name: "Chandigarh", lat: 30.7333, lng: 76.7794, pincodePrefix: "160" },
      { name: "Ludhiana", lat: 30.9010, lng: 75.8573, pincodePrefix: "141" },
      { name: "Amritsar", lat: 31.6340, lng: 74.8723, pincodePrefix: "143" }
    ]
  },
  {
    name: "Bihar",
    cities: [
      { name: "Patna", lat: 25.5941, lng: 85.1376, pincodePrefix: "800" },
      { name: "Gaya", lat: 24.7955, lng: 85.0002, pincodePrefix: "823" }
    ]
  },
  {
    name: "Assam",
    cities: [
      { name: "Guwahati", lat: 26.1445, lng: 91.7362, pincodePrefix: "781" }
    ]
  },
  {
    name: "Goa",
    cities: [
      { name: "Panaji", lat: 15.4909, lng: 73.8278, pincodePrefix: "403" },
      { name: "Margao", lat: 15.2832, lng: 73.9862, pincodePrefix: "403" }
    ]
  }
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

export interface BloodCompatibility {
  group: BloodGroup;
  canGiveTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  description: string;
}

export const BLOOD_COMPATIBILITY: Record<BloodGroup, BloodCompatibility> = {
  "O-": {
    group: "O-",
    canGiveTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    canReceiveFrom: ["O-"],
    description: "Universal Red Cell Donor. Crucial in emergency trauma surgeries where patient blood group is not yet determined."
  },
  "O+": {
    group: "O+",
    canGiveTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O+", "O-"],
    description: "Most common blood group in India (~37% of population). High demand for routine and surgical transfusions."
  },
  "A+": {
    group: "A+",
    canGiveTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    description: "Widely needed blood group (~22% of population). Frequently needed in oncology and elective procedures."
  },
  "A-": {
    group: "A-",
    canGiveTo: ["A+", "A-", "AB+", "AB-"],
    canReceiveFrom: ["A-", "O-"],
    description: "Rare blood group in India (<2%). Essential for Rh-negative expectant mothers and trauma patients."
  },
  "B+": {
    group: "B+",
    canGiveTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    description: "Prevalent blood group in India (~33% of population). Continuous requirement in multi-specialty hospitals."
  },
  "B-": {
    group: "B-",
    canGiveTo: ["B+", "B-", "AB+", "AB-"],
    canReceiveFrom: ["B-", "O-"],
    description: "Rare blood group (<2%). Vital for cardiac surgeries and severe anemia treatments."
  },
  "AB+": {
    group: "AB+",
    canGiveTo: ["AB+"],
    canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    description: "Universal Red Cell Recipient and Universal Plasma Donor. Can receive from all blood groups safely."
  },
  "AB-": {
    group: "AB-",
    canGiveTo: ["AB+", "AB-"],
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
    description: "Rarest blood group in India (~0.5%). Rapid response donor networking is critical for life-saving care."
  }
};

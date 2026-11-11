-- =========================================================================
-- BLOODBRIDGE - SUPABASE DATABASE SETUP & SEED SCRIPT
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing partial tables if any
DROP TABLE IF EXISTS public.donors CASCADE;
DROP TABLE IF EXISTS public.blood_requests CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;

-- 1. DONORS TABLE
CREATE TABLE public.donors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    gender TEXT NOT NULL,
    age INTEGER NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    availability TEXT NOT NULL DEFAULT 'Available',
    phone_visibility TEXT NOT NULL DEFAULT 'request_only',
    preferred_contact TEXT DEFAULT 'Phone & WhatsApp',
    total_donations INTEGER DEFAULT 0,
    last_donation_date DATE,
    registered_date DATE DEFAULT CURRENT_DATE,
    verified BOOLEAN DEFAULT true,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BLOOD REQUESTS TABLE
CREATE TABLE public.blood_requests (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    units_needed INTEGER NOT NULL DEFAULT 1,
    urgency TEXT NOT NULL DEFAULT 'Immediate',
    hospital_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    requirement_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. REPORTS TABLE
CREATE TABLE public.reports (
    id TEXT PRIMARY KEY,
    reported_item_type TEXT NOT NULL,
    reported_item_id TEXT NOT NULL,
    reported_item_name TEXT,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public donors are viewable by everyone" 
ON public.donors FOR SELECT USING (true);

CREATE POLICY "Anyone can register as a voluntary donor" 
ON public.donors FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update donor availability" 
ON public.donors FOR UPDATE USING (true);

CREATE POLICY "Public blood requests are viewable by everyone" 
ON public.blood_requests FOR SELECT USING (true);

CREATE POLICY "Anyone can submit a blood request" 
ON public.blood_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit a report" 
ON public.reports FOR INSERT WITH CHECK (true);

-- 5. SEED 10 DEMO DONORS ACROSS 10 DISTINCT INDIAN LOCATIONS
INSERT INTO public.donors (
    id, name, blood_group, gender, age, state, city, pincode, phone, email, 
    availability, phone_visibility, preferred_contact, total_donations, 
    last_donation_date, registered_date, verified, latitude, longitude, bio
) VALUES
-- 1. Mumbai, Maharashtra (O+)
(
    'donor-1', 'Dr. Rajesh Kulkarni', 'O+', 'Male', 34, 
    'Maharashtra', 'Mumbai', '400001', '+91 98201 44521', 'rajesh.k@example.com',
    'Available', 'request_only', 'Phone & WhatsApp', 14, 
    '2026-08-12', '2024-03-10', true, 18.9388, 72.8354, 
    'Physician & regular voluntary donor. Always happy to step in during emergencies in South Mumbai.'
),
-- 2. Pune, Maharashtra (A+)
(
    'donor-2', 'Pooja Deshmukh', 'A+', 'Female', 28, 
    'Maharashtra', 'Pune', '411004', '+91 98902 33119', 'pooja.d@example.com',
    'Available', 'visible', 'WhatsApp', 6, 
    '2026-09-04', '2025-01-15', true, 18.5204, 73.8567, 
    'Software developer in Shivaji Nagar. Ready to donate at Ruby Hall or Jehangir Hospital.'
),
-- 3. Kolkata, West Bengal (B+)
(
    'donor-3', 'Amitabh Sen', 'B+', 'Male', 39, 
    'West Bengal', 'Kolkata', '700029', '+91 98305 77124', 'amitabh.sen@example.com',
    'Available', 'request_only', 'Phone', 19, 
    '2026-07-20', '2023-11-02', true, 22.5726, 88.3639, 
    'College professor. Voluntary blood donor advocate in South Kolkata and Salt Lake.'
),
-- 4. Delhi NCR, Delhi (O-)
(
    'donor-4', 'Simran Kaur', 'O-', 'Female', 25, 
    'Delhi', 'Delhi', '110001', '+91 98110 55672', 'simran.k@example.com',
    'Available', 'request_only', 'WhatsApp', 4, 
    '2026-06-15', '2025-05-18', true, 28.6139, 77.2090, 
    'Universal donor (O-). Dedicated to assisting critical surgical and pediatric emergencies.'
),
-- 5. Bengaluru, Karnataka (AB+)
(
    'donor-5', 'Karthik Subramanian', 'AB+', 'Male', 31, 
    'Karnataka', 'Bengaluru', '560034', '+91 99001 88234', 'karthik.sub@example.com',
    'Available', 'visible', 'Phone & WhatsApp', 9, 
    '2026-08-30', '2024-08-11', true, 12.9352, 77.6245, 
    'Resident of Koramangala. Available for St. Johns Hospital and Manipal Hospital requests.'
),
-- 6. Chennai, Tamil Nadu (A-)
(
    'donor-6', 'Ananya Sundaram', 'A-', 'Female', 29, 
    'Tamil Nadu', 'Chennai', '600018', '+91 98402 11983', 'ananya.s@example.com',
    'Available', 'request_only', 'Email & WhatsApp', 7, 
    '2026-08-18', '2024-02-19', true, 13.0418, 80.2541, 
    'Rare A- donor in Alwarpet. Active volunteer at Government General Hospital.'
),
-- 7. Jaipur, Rajasthan (B-)
(
    'donor-7', 'Vikram Rathore', 'B-', 'Male', 36, 
    'Rajasthan', 'Jaipur', '302001', '+91 94140 66231', 'vikram.r@example.com',
    'Available', 'request_only', 'Phone', 12, 
    '2026-06-28', '2023-09-05', true, 26.9124, 75.7873, 
    'Civil engineer in C-Scheme. Active with SMS Medical College Blood Bank.'
),
-- 8. Ahmedabad, Gujarat (AB-)
(
    'donor-8', 'Farhan Shaikh', 'AB-', 'Male', 27, 
    'Gujarat', 'Ahmedabad', '380009', '+91 98251 90812', 'farhan.s@example.com',
    'Available', 'request_only', 'WhatsApp', 5, 
    '2026-07-11', '2025-02-14', true, 23.0338, 72.5850, 
    'Extremely rare AB- donor. Quick responder for emergency surgeries in Navrangpura.'
),
-- 9. Hyderabad, Telangana (O+)
(
    'donor-9', 'Sneha Reddy', 'O+', 'Female', 30, 
    'Telangana', 'Hyderabad', '500034', '+91 98490 44219', 'sneha.reddy@example.com',
    'Available', 'visible', 'Phone & WhatsApp', 8, 
    '2026-05-19', '2024-06-20', true, 17.4239, 78.4738, 
    'Biotech researcher in Banjara Hills. Ready to assist at NIMS or Apollo Jubilee Hills.'
),
-- 10. Lucknow, Uttar Pradesh (B+)
(
    'donor-10', 'Manish Tiwari', 'B+', 'Male', 42, 
    'Uttar Pradesh', 'Lucknow', '226001', '+91 94150 12890', 'manish.tiwari@example.com',
    'Available', 'request_only', 'Phone', 23, 
    '2026-08-01', '2022-04-12', true, 26.8467, 80.9462, 
    'KGMU volunteer and 20+ times blood donor. Hazratganj resident.'
);

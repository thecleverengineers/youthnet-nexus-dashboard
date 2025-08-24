// Structured seed data for quick staff import
export interface StaffSeedItem {
  sNo: number
  name: string
  gender?: 'Male' | 'Female' | ''
  dateOfJoining?: string // Various formats from input; we'll normalize at runtime
  designation: string
}

export const staffSeed: StaffSeedItem[] = [
  { sNo: 1, name: 'Nuneseno Chase', gender: 'Female', dateOfJoining: '05-12-2014', designation: 'Director' },
  { sNo: 2, name: 'Neikepekho Shosahie', gender: 'Male', dateOfJoining: '', designation: 'Associate Director - Entrepreneurship' },
  { sNo: 3, name: 'Samuel Magh', gender: 'Male', dateOfJoining: '14/02/2009', designation: 'Senior Accountant' },
  { sNo: 4, name: 'Esther Angami', gender: 'Female', dateOfJoining: '05-09-2022', designation: 'HR Manager' },
  { sNo: 5, name: 'Koi Khiamniungan', gender: 'Male', dateOfJoining: '06-03-2024', designation: 'Manager - Employment & Livelihood' },
  { sNo: 6, name: 'Florida Jigdong', gender: 'Female', dateOfJoining: '24/1/2022', designation: 'Manager - Education Programs' },
  { sNo: 7, name: 'Amenla Aier', gender: 'Female', dateOfJoining: '07-01-2017', designation: 'Manager - Made In Nagaland Centre (MIN)' },
  { sNo: 8, name: 'Loli Ashevei', gender: 'Male', dateOfJoining: '16/9/2023', designation: 'Program Manager - AI Training' },
  { sNo: 9, name: 'Likumri Changkiri', gender: 'Male', dateOfJoining: '04-01-2025', designation: 'Program Lead - Raising and Accelerating MSME Performance (RAMP) Scheme' },
  { sNo: 10, name: 'Sentirenla Imsong', gender: 'Female', dateOfJoining: '24/3/2025', designation: 'Program Manager - RAMP (Operations, Data & Quality)' },
  { sNo: 11, name: 'Mariam Paul', gender: 'Female', dateOfJoining: '17/08/2023', designation: 'Program Coordinator - Entrepreneurship Development Centre (EDC)' },
  { sNo: 12, name: 'Vetolu Dawhuo', gender: 'Female', dateOfJoining: '07-01-2023', designation: 'Community Engagement Supervisor - RAMP' },
  { sNo: 13, name: 'Lika Chophy', gender: 'Female', dateOfJoining: '05-01-2023', designation: 'Program Coordinator - Skills to Succeed (S2S)' },
  { sNo: 14, name: 'Sutiba Y Sangtam', gender: 'Male', dateOfJoining: '09-04-2022', designation: 'Facilitator' },
  { sNo: 15, name: 'Kelhouwenuo Rupreo', gender: 'Female', dateOfJoining: '03-03-2025', designation: 'Facilitator' },
  { sNo: 16, name: 'Tenyenle Kent', gender: 'Female', dateOfJoining: '03-03-2025', designation: 'HR Associate - YouthNet Job Centre (YJC)' },
  { sNo: 17, name: 'Meriyani Shitiri', gender: 'Female', dateOfJoining: '04-01-2025', designation: 'HR Associate - YouthNet Job Centre (YJC)' },
  { sNo: 18, name: 'Changsonla A Chang', gender: 'Female', dateOfJoining: '08-01-2018', designation: 'Stock & Inventory Associate - MIN' },
  { sNo: 19, name: 'Lenshetshu Thyorr', gender: 'Female', dateOfJoining: '09-01-2024', designation: 'Sales & Customer Associate - MIN' },
  { sNo: 20, name: 'Hannah Semy', gender: 'Female', dateOfJoining: '02-10-2025', designation: 'Sales & Stock Associate - MIN' },
  { sNo: 21, name: 'Helkhosiem Singson', gender: 'Male', dateOfJoining: '17/4/2023', designation: 'Mobilizer - Skill Development' },
  { sNo: 22, name: 'Shatile Kent', gender: 'Female', dateOfJoining: '20/1/2025', designation: 'Trainer – Processed Food Entrepreneur' },
  { sNo: 23, name: 'Apila C Sangtam', gender: 'Female', dateOfJoining: '30/07/2023', designation: 'Associate – Skill Development' },
  { sNo: 24, name: 'Moatoshi Jamir', gender: 'Male', dateOfJoining: '27/5/2024', designation: 'MIS Executive - Skill Development' },
  { sNo: 25, name: 'K Lachim Yimchunger', gender: 'Male', dateOfJoining: '10-01-2024', designation: 'Associate - Marketing, YouthNet Incubation Centre (YIC)' },
  { sNo: 26, name: 'Dieze Khamo', gender: 'Male', dateOfJoining: '10-01-2024', designation: 'Associate - MSME, YouthNet Incubation Centre (YIC)' },
  { sNo: 27, name: 'Tumchobeni Y. Tsopoe', gender: 'Female', dateOfJoining: '17/9/2024', designation: 'Associate - YouthNet Incubation Centre (YIC)' },
  { sNo: 28, name: 'Khrolo Lasushe', gender: 'Male', dateOfJoining: '01-08-2018', designation: 'Multimedia & Communications' },
  { sNo: 29, name: 'Jochuhyulo Thong', gender: 'Male', dateOfJoining: '17/6/2024', designation: 'Multimedia Executive' },
  { sNo: 30, name: 'N. Toino Yeptho', gender: 'Male', dateOfJoining: '08-08-2024', designation: 'Multimedia Executive' },
  { sNo: 31, name: 'Adile Sumi', gender: 'Female', dateOfJoining: '', designation: 'Housekeeping - Dimapur' },
  { sNo: 32, name: 'Shunglun G Phom', gender: 'Male', dateOfJoining: '01-06-2020', designation: 'Housekeeping - Dimapur' },
  { sNo: 33, name: 'Sholei Phom', gender: 'Female', dateOfJoining: '06-02-2025', designation: 'Housekeeping - Kohima' },
  { sNo: 34, name: 'Alum Konyak', gender: 'Female', dateOfJoining: '', designation: 'Housekeeping - MIN' },
]

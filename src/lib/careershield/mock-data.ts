import type { RiskLevel } from "./session";

export const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "E-commerce", "EdTech",
  "Marketing", "Automotive", "CleanTech", "Manufacturing", "Retail",
];
export const COUNTRIES = ["India", "USA", "UK", "Germany", "Canada", "Singapore"];
export const LOCATIONS = [
  "Bangalore", "New York", "Hyderabad", "San Francisco", "Delhi", "Seattle",
  "London", "Boston", "Pune", "Detroit", "Austin", "Mumbai",
];
export const STAGES = ["Seed", "Series A", "Series B", "Series C", "Series D", "IPO"];

export const ROLES = [
  "Backend Developer", "Frontend Developer", "Full Stack Developer",
  "Data Scientist", "DevOps Engineer", "Mobile Developer", "ML Engineer",
  "Product Manager", "UI/UX Designer",
];

export const ROLE_SKILL_MAP: Record<string, string[]> = {
  "Backend Developer": ["Java", "Spring Boot", "SQL", "Git", "REST APIs", "AWS", "Docker", "Kubernetes", "System Design", "Redis", "Kafka", "GraphQL", "MongoDB", "Microservices", "CI/CD"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Redux", "GraphQL", "Webpack", "Jest", "Accessibility"],
  "Full Stack Developer": ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "MongoDB", "AWS", "Docker", "Git", "REST APIs", "GraphQL", "CI/CD"],
  "Data Scientist": ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "SQL", "Statistics", "Tableau", "Power BI", "MLOps"],
  "DevOps Engineer": ["Linux", "Docker", "Kubernetes", "AWS", "Terraform", "Jenkins", "Ansible", "Prometheus", "Grafana", "CI/CD", "Bash"],
  "Mobile Developer": ["Swift", "Kotlin", "React Native", "Flutter", "Dart", "Firebase", "REST APIs", "Git"],
  "ML Engineer": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "MLOps", "Docker", "Kubernetes", "AWS SageMaker", "Airflow", "SQL"],
  "Product Manager": ["Roadmapping", "Agile", "Scrum", "JIRA", "Analytics", "SQL", "User Research", "A/B Testing"],
  "UI/UX Designer": ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Design Systems"],
};

export interface CompanyRow {
  company: string;
  industry: string;
  location: string;
  country: string;
  stage: string;
  funds: number;
  laidOffPct: number;
  laidOffCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
}

const COMPANY_NAMES = [
  "TechNova Solutions", "FinWise Inc.", "HealthPlus Systems", "ShopEase", "EduFuture",
  "DataStream AI", "MarketGenius", "BioCure Labs", "CloudScale", "AutoMove",
  "GreenFuture Energy", "PixelForge", "RetailHub", "BankBridge", "MediCore",
  "NetWeave", "AutoVista", "SkyMart", "LearnLoop", "Quantix Labs",
  "AeroNexus", "VeloCity", "PulseHealth", "OrbitPay", "BrewCart",
  "NovaBank", "LoopMedia", "FintechX", "Caretrack", "MetroDrive",
];

const riskLevel = (s: number): RiskLevel => (s >= 70 ? "High" : s >= 40 ? "Medium" : "Low");

export const generateBulkRows = (n = 100): CompanyRow[] => {
  const rows: CompanyRow[] = [];
  // seeded pseudo-random for stability
  let seed = 1;
  const r = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < n; i++) {
    const score = Math.floor(r() * 100);
    rows.push({
      company: COMPANY_NAMES[i % COMPANY_NAMES.length] + (i >= COMPANY_NAMES.length ? ` ${Math.floor(i / COMPANY_NAMES.length) + 1}` : ""),
      industry: INDUSTRIES[Math.floor(r() * INDUSTRIES.length)],
      location: LOCATIONS[Math.floor(r() * LOCATIONS.length)],
      country: COUNTRIES[Math.floor(r() * COUNTRIES.length)],
      stage: STAGES[Math.floor(r() * STAGES.length)],
      funds: Math.floor(r() * 12_000_000) + 200_000,
      laidOffPct: Math.floor(r() * 70) + 5,
      laidOffCount: Math.floor(r() * 400) + 10,
      riskScore: score,
      riskLevel: riskLevel(score),
    });
  }
  return rows;
};

export const computeRiskScore = (input: {
  funds: number;
  laidOffPct: number;
  laidOffCount: number;
  stage: string;
}) => {
  let s = 30;
  s += Math.min(35, input.laidOffPct * 0.5);
  s += Math.min(20, input.laidOffCount / 20);
  if (input.funds < 1_000_000) s += 10;
  if (input.stage === "Seed" || input.stage === "Series A") s += 5;
  s = Math.min(99, Math.max(5, Math.round(s)));
  return { score: s, level: riskLevel(s) };
};

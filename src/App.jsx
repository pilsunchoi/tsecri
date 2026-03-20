import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const COLORS = {
  ink: "#1a1a18",
  paper: "#f6f4ef",
  cream: "#ece8df",
  accent: "#b5432a",
  accentLight: "#d4654f",
  muted: "#8a8578",
  border: "#d5d0c5",
  blue: "#2c5d8a",
  blueLight: "#e8f0f6",
  green: "#3a6b4a",
  greenLight: "#e6f0ea",
  warm: "#c49a6c",
  warmLight: "#f5efe6",
};

const LITERATURE = {
  causal: {
    title: "Causal identification",
    subtitle: "Causal effect estimation",
    icon: "⟁",
    desc: "Analyzing the causal impact of the 8.5% cap using DID, IV, Synthetic Control, and related methods. The Texas cap provides a rare quasi-natural experiment for identifying the long-run effects of special education services.",
    papers: [
      {
        authors: "Ballis, B. & Heath, K.",
        year: 2021,
        title: "The Long-Run Impacts of Special Education",
        journal: "American Economic Journal: Economic Policy, 13(4), 72–111",
        summary: "The landmark study exploiting the Texas cap. Tracked a cohort of 227,000 fifth-grade special education students and found that those who lost services due to the cap experienced a 51.9% decline in high school graduation and a 37.9% drop in college enrollment, identified via DID and IV. Effects were concentrated among low-income and minority students. Suggests that long-run benefits of special education for marginal participants are comparable to the Perry Preschool program.",
        method: "DID + IV",
        url: "https://www.aeaweb.org/articles?id=10.1257/pol.20190603",
        tag: "landmark",
      },
      {
        authors: "Ballis, B. & Heath, K.",
        year: 2021,
        title: "Direct and Spillover Effects of Limiting Minority Student Access to Special Education",
        journal: "EdWorkingPaper No. 21-364, Annenberg Institute at Brown University",
        summary: "Analyzes the direct and indirect effects of the disproportionality cap on Black students' high school graduation and college enrollment. Finds that reducing misclassification of Black students in special education may actually narrow racial achievement gaps. Also identifies a spillover effect: general education Black and Hispanic students saw graduation and college enrollment drop by approximately 0.5 percentage points.",
        method: "DID",
        url: "https://edworkingpapers.com/ai21-364",
        tag: "spillover",
      },
      {
        authors: "Ballis, B.",
        year: 2024,
        title: "Early Life Health Conditions and Racial Gaps in Education",
        journal: "Working Paper 2024-016, Human Capital and Economic Opportunity Working Group",
        summary: "Uses Texas administrative data and the shift to Medicaid Managed Care to analyze how racial disparities in infant health conditions affect long-run educational outcomes, including special education identification. An extension of the cap research exploring the health-education nexus in racial inequality mechanisms.",
        method: "IV (Medicaid MMC shift)",
        url: "https://edworkingpapers.com/authors/briana-ballis",
        tag: "extension",
      },
      {
        authors: "Ballis, B.",
        year: 2020,
        title: "Does Peer Motivation Impact Educational Investments? Evidence From DACA",
        journal: "EdWorkingPaper No. 20-333, Annenberg Institute at Brown University",
        summary: "Finds that DACA increased educational investment among undocumented youth, with positive spillover effects on DACA-ineligible peers attending the same schools. Validates the theoretical mechanism (peer effects) behind the spillover effects found in the special education cap research, in a separate policy context.",
        method: "DID (LA administrative data)",
        url: "https://edworkingpapers.com/ai20-333",
        tag: "spillover",
      },
      {
        authors: "Antonovics, K., Black, S. E., Cullen, J. B. & Meiselman, A. Y.",
        year: 2022,
        title: "Patterns, Determinants, and Consequences of Ability Tracking: Evidence from Texas Public Schools",
        journal: "NBER Working Paper No. 30370",
        summary: "Analyzes ability tracking in Texas public schools using 2011–2019 administrative data. Confirms that special education placement is a key axis of ability-based sorting. Cites Ballis & Heath (2021) to provide comparative context for long-run effects of special education placement. Suggests that negative tracking effects on low-achieving students operate through mechanisms similar to service loss during the cap period.",
        method: "Administrative data analysis",
        url: "https://www.nber.org/papers/w30370",
        tag: "comparison",
      },
    ],
  },
  equity: {
    title: "Equity & disparities",
    subtitle: "Racial and socioeconomic gaps",
    icon: "◈",
    desc: "Studies analyzing how the cap differentially affected racial, linguistic, and income groups, and substitution effects across disability types. The central issue is how the PBMAS sequentially suppressed identification of Black and ELL students.",
    papers: [
      {
        authors: "Morgan, P. L., Woods, A. D., Wang, Y. & Gloski, C. A.",
        year: 2023,
        title: "Texas Special Education Cap's Associations With Disability Identification Disparities of Racial and Language Minority Students",
        journal: "Exceptional Children, 89(2), 185–203",
        summary: "Applies a time-varying effect model to NAEP fourth-grade data (N=300,460). Comparing Texas students to those in adjoining states over 2003–2017, finds that the probability of disability identification for Black and ELL students gradually declined after the cap's adoption. Under-identification persisted even after controlling for individual-level academic achievement, suggesting policy suppression rather than achievement differences as the cause.",
        method: "Time-varying effect model + NAEP cross-state comparison",
        url: "https://journals.sagepub.com/doi/full/10.1177/00144029221109849",
        tag: "landmark",
      },
      {
        authors: "DeMatthews, D. E. & Knight, D. S.",
        year: 2019,
        title: "The Texas Special Education Cap: Exploration into the Statewide Delay and Denial of Support to Students with Disabilities",
        journal: "Education Policy Analysis Archives, 27(2)",
        summary: "A systematic policy analysis of the design and operation of PBMAS Indicator 10. Uses district-level data to document how the 8.5% threshold altered special education identification behaviors across approximately 1,200 Texas school districts, and identifies structural flaws in TEA's monitoring system.",
        method: "Policy analysis + descriptive statistics",
        url: "https://epaa.asu.edu/index.php/epaa/article/view/3793",
        tag: "policy",
      },
      {
        authors: "DeMatthews, D. E. & Knight, D. S.",
        year: 2019,
        title: "Denying Special Education to Students in Need: A Case of Accountability, Compliance, and Fear in a Texas Elementary School",
        journal: "Journal of Cases in Educational Leadership, 22(1), 55–72",
        summary: "A case study analyzing how the cap operated at the school level. Documents a newly hired principal being pressured by supervisors and the superintendent to keep special education rates low, capturing the mechanism by which policy translates into ethical dilemmas for school leadership.",
        method: "Qualitative case study",
        url: "https://journals.sagepub.com/doi/full/10.1177/1555458918786988",
        tag: "qualitative",
      },
      {
        authors: "Farkas, G., Morgan, P. L., Hillemeier, M. M., Mitchell, C. & Woods, A. D.",
        year: 2020,
        title: "District-Level Achievement Gaps Explain Black and Hispanic Overrepresentation in Special Education",
        journal: "Exceptional Children, 86(4), 374–394",
        summary: "Examines whether district-level racial achievement gaps explain overrepresentation in special education. Finds that controlling for district-level confounders—especially racial achievement gaps—eliminates the apparent overrepresentation of Black and Hispanic students. Suggests that the Texas cap's disproportionality policy may have suppressed legitimate reflections of achievement gaps rather than actual over-identification.",
        method: "Merged administrative + civil rights data",
        url: "https://journals.sagepub.com/doi/abs/10.1177/0014402919893695",
        tag: "comparison",
      },
      {
        authors: "Elder, T., Figlio, D., Imberman, S. & Persico, C.",
        year: 2019,
        title: "School Segregation and Racial Gaps in Special Education Identification",
        journal: "NBER Working Paper No. 25829",
        summary: "Analyzes how within-school racial composition affects disability identification. Finds that minority students attending predominantly non-White schools are less likely to be identified with disabilities. An important comparative study for understanding how Texas's race-specific disproportionality indicators interact with school-level racial segregation.",
        method: "Administrative data + school fixed effects",
        url: "https://www.nber.org/papers/w25829",
        tag: "comparison",
      },
    ],
  },
  postcap: {
    title: "Post-cap dynamics",
    subtitle: "Trends after cap removal",
    icon: "↺",
    desc: "Studies examining whether the sharp enrollment rebound following the 2016 Houston Chronicle exposé and 2018 federal intervention represents normalization or over-identification, and the impact of COVID-19.",
    papers: [
      {
        authors: "DeMatthews, D. E., Reyes, P., Shin, J. & Hart, T. D.",
        year: 2025,
        title: "Texas Special Education Report: 13 Takeaways for Texans",
        journal: "Texas Education Research Center (TexERC), UT Austin",
        summary: "A comprehensive report on Texas special education from 2000 to 2024. Documents the U-shaped enrollment pattern (12%→8.5%→15.3%), a 14-fold increase in students with autism (8,650→119,641), widening gap between charter and traditional public schools (0.5pp→3.4pp), 39% three-year attrition rate for special education teachers, and inclusive placement disparities between affluent and low-income schools. Summarizes 13 key findings.",
        method: "Descriptive longitudinal analysis",
        url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf",
        tag: "landmark",
      },
      {
        authors: "Knight, D. S. & DeMatthews, D. E.",
        year: 2020,
        title: "Expanding the Use of Educational Data for Social Justice: Lessons From the Texas Cap on Special Education",
        journal: "Journal of Research on Leadership Education, 15(2), 109–132",
        summary: "Drawing lessons from the cap case, proposes how educational data can be leveraged for social justice. Presents three key metrics for identifying IDEA non-compliance and introduces a methodology for detecting 'outlier' districts with significantly lower special education rates than otherwise similar districts.",
        method: "Policy analysis + data framework",
        url: "https://journals.sagepub.com/doi/10.1177/1942775118783710",
        tag: "policy",
      },
      {
        authors: "Hopkins, B. G., Strunk, K. O., Imberman, S. A. et al.",
        year: 2023,
        title: "Trends in Special Education Identification During the COVID-19 Pandemic: Evidence from Michigan",
        journal: "NBER Working Paper No. 31261",
        summary: "Analyzes special education identification trends during the COVID-19 pandemic using Michigan data. Provides national context for the period when the Texas post-cap rebound and pandemic effects overlapped. A useful comparative study for determining whether the nationwide surge in special education identification is Texas-specific or a broader trend.",
        method: "Event study + descriptive analysis",
        url: "https://www.nber.org/papers/w31261",
        tag: "comparison",
      },
      {
        authors: "Texas Education Agency",
        year: 2025,
        title: "Enrollment in Texas Public Schools, 2024-25",
        journal: "TEA Division of Research and Analysis, Document No. GE26 601 02",
        summary: "Ten-year enrollment trends from 2014-15 to 2024-25. Provides specific figures showing the special education rate rising from 8.5% in 2014-15 to 15.3% in 2024-25. Total enrollment of 5.54 million with disaggregated data by race, economic status, and program type. Includes comparison across the four most populous states (TX, CA, NY, FL).",
        method: "Administrative data report",
        url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enroll-2024-25.pdf",
        tag: "data",
      },
      {
        authors: "Advocacy Institute (Cortiella, C.)",
        year: 2024,
        title: "Number of IDEA-eligible Students Increases 3 Percent in 2024",
        journal: "Advocacy Institute Blog / IDEA Section 618 Data Analysis",
        summary: "Analysis of 2024 IDEA Section 618 data. Nationwide special education enrollment reached 8.19 million (3.8% increase). Texas's increase (77,404 students) accounted for 27% of the national total. If the trend of adding roughly 1 million students between 2021 and 2025 continues, it would be historically unprecedented. By disability type, autism, multiple disabilities, and developmental delay showed the largest increases.",
        method: "Federal data analysis (IDEA 618)",
        url: "https://www.advocacyinstitute.org/blog/",
        tag: "data",
      },
    ],
  },
  fiscal: {
    title: "Fiscal & labor effects",
    subtitle: "Spending and teacher labor markets",
    icon: "§",
    desc: "How the post-cap surge in special education spending affects district finances and teacher supply-demand imbalances. The feedback loop between rising special education teacher attrition and the expansion of uncertified teachers on service quality is a central concern.",
    papers: [
      {
        authors: "DeMatthews, D. E., Knight, D. S. & Shin, J.",
        year: 2022,
        title: "The Principal-Teacher Churn: Understanding the Relationship Between Leadership Turnover and Teacher Attrition",
        journal: "Educational Administration Quarterly, 58(1), 73–109",
        summary: "Analyzes how principal turnover drives teacher attrition. Identifies leadership instability as a structural cause of high special education teacher attrition (39% within three years for the 2019 cohort). Links the concentration of uncertified/alternatively certified teachers in schools serving low-income and minority students to the post-cap demand surge.",
        method: "Longitudinal administrative data analysis",
        url: "https://doi.org/10.1177/0013161X211051974",
        tag: "labor",
      },
      {
        authors: "Stock, W. & Schultz, G.",
        year: 2025,
        title: "Public Health Insurance and Special Education Enrollment",
        journal: "Economics of Education Review, 105(C)",
        summary: "Analyzes how public health insurance expansion affects special education enrollment. Explores the mechanism by which Medicaid expansion increases access to disability diagnosis, thereby changing special education identification rates. An important background study for understanding the extent to which the post-cap surge in identification is linked to changes in healthcare access.",
        method: "Quasi-experimental",
        url: "https://ideas.repec.org/a/eee/ecoedu/v105y2025ics0272775724001006.html",
        tag: "fiscal",
      },
      {
        authors: "Texas Education Agency",
        year: 2025,
        title: "TEA Annual Report 2025",
        journal: "Texas Education Agency Official Publication",
        summary: "2024-25 school year overview: 857,000+ special education students, approximately $8.5 billion in special education spending plus $365.1 million for dyslexia services. Includes $200 million in additional funding through HB2. In many districts, state allocations fall short of actual service costs (e.g., Austin ISD spent $170 million vs. $96.6 million received from the state).",
        method: "Administrative data report",
        url: "https://tea.texas.gov/about-tea/news-and-multimedia/annual-reports/annual-report-2025-0.pdf",
        tag: "data",
      },
      {
        authors: "Knight, D. S., Candelaria, C. A., Sun, M. et al.",
        year: 2024,
        title: "Principal Retention and Turnover During the COVID-19 Era: Do Students Have Equitable Access to Stable School Leadership?",
        journal: "Center for the Study of Teaching and Learning, University of Washington",
        summary: "Analyzes how principal turnover during the COVID-19 era affects special education service stability. Finds that principal turnover rates are higher in low-income, high-minority schools, threatening the continuity of special education programs. Emphasizes the importance of leadership stability amid rapidly growing post-cap special education demand.",
        method: "Administrative data (multi-state)",
        url: "http://hdl.handle.net/1773/51017",
        tag: "labor",
      },
      {
        authors: "Phillips, C.",
        year: 2024,
        title: "Texas School Districts Lose $300 Million in Federal Special Education Funding",
        journal: "Texas Public Radio, Investigative Report",
        summary: "Reports that Texas school districts lost $300 million in federal special education funding due to TEA's improper Medicaid reimbursement coding. Reveals that fiscal mismanagement continued even after the cap was lifted, following the illegal budget cuts during the cap period.",
        method: "Investigative journalism",
        url: "https://www.tpr.org/education/2024-01-11/texas-school-districts-lose-300-million-in-federal-special-education-funding",
        tag: "fiscal",
      },
    ],
  },
  charter: {
    title: "Charter school selection",
    subtitle: "Charter vs. traditional public schools",
    icon: "⊞",
    desc: "Analyzing why charter schools serve significantly fewer special education students than traditional public schools. The cream-skimming vs. self-sorting debate and the issue of burden-shifting to public schools are central concerns.",
    papers: [
      {
        authors: "DeMatthews, D. E., Reyes, P., Shin, J. & Hart, T. D.",
        year: 2025,
        title: "Texas Special Education Report — Findings 11-13 (Charter Schools)",
        journal: "TexERC Report, UT Austin",
        summary: "Documents the widening gap in special education enrollment between traditional public schools and charter schools, from 0.5 percentage points in 2008 to 3.4 percentage points in 2024. The five largest CMOs (KIPP, IDEA, Harmony, etc.) have special education rates well below the state average. Disaggregates by disability type, showing that students with intellectual disabilities, emotional disturbance, and autism are concentrated in traditional public schools.",
        method: "Descriptive trend analysis",
        url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf",
        tag: "landmark",
      },
      {
        authors: "Knight, D. S., Shin, J. & McMorris, C.",
        year: 2022,
        title: "Student Mobility between Charter and Traditional Public School Sectors: Assessing Enrollment Patterns among Major Charter Management Organizations in Texas",
        journal: "Education Sciences, 12(12), 915",
        summary: "Analyzes student transfer patterns among Texas's four largest charter networks. Finds that charter schools enroll fewer special education students but more low-income and ELL students. Cross-sector transfers contribute to special education enrollment gaps, but patterns differ by charter network and grade level, making a blanket cream-skimming determination difficult.",
        method: "Administrative data (student-level transfers)",
        url: "https://www.mdpi.com/2227-7102/12/12/915",
        tag: "landmark",
      },
      {
        authors: "Knight, D. S. & Toenjes, L. A.",
        year: 2020,
        title: "Do Charter Schools Receive Their Fair Share of Funding? School Finance Equity for Charter and Traditional Public Schools",
        journal: "Education Policy Analysis Archives, 28",
        summary: "Analyzes funding equity between charter and traditional public schools. Explores how differences in special education enrollment rates affect cost structures and fiscal needs across school types.",
        method: "School finance analysis",
        url: "https://epaa.asu.edu/index.php/epaa/article/view/4438",
        tag: "fiscal",
      },
      {
        authors: "DeMatthews, D. E., Hart, T. D. & Knight, D. S.",
        year: 2024,
        title: "Taxpayer-Funded Private School Vouchers and Market Failure: A Policy Scan and Review from 1869 to 2024",
        journal: "Education Policy Analysis Archives",
        summary: "Analyzes the potential impact of Texas's private school voucher push on special education students from a historical perspective. Warns that the pattern of special education avoidance seen in charter schools may intensify under a voucher system.",
        method: "Historical policy analysis + literature review",
        url: "https://epaa.asu.edu/index.php/epaa/article/view/8164",
        tag: "policy",
      },
      {
        authors: "Duncheon, J., DeMatthews, D. E. & Smith, T.",
        year: 2024,
        title: "Cream Skimming in an Early College High School: A First-Year Principal's Dilemma in a High-Performing Campus",
        journal: "Journal of Cases in Educational Leadership, 27(2), 3–18",
        summary: "A case study of the underrepresentation of students with disabilities and ELLs in an Early College High School, told through the experience of a first-year principal. Suggests that the same cream-skimming mechanisms found in the charter school debate also operate within district-run choice programs. Captures structural exclusion in the admissions process and the ethical dilemmas facing school leaders.",
        method: "Qualitative case study",
        url: "https://journals.sagepub.com/doi/full/10.1177/15554589231196780",
        tag: "qualitative",
      },
    ],
  },
};

const AREAS_ORDER = ["causal", "equity", "postcap", "fiscal", "charter"];

const TIMELINE = [
  { year: 2004, event: "TEA adopts PBMAS — 8.5% cap begins", type: "policy", src: "DeMatthews & Knight (2019) EPAA", url: "https://epaa.asu.edu/index.php/epaa/article/view/3793" },
  { year: 2006, event: "ELL enrollment performance indicator added", type: "policy", src: "Morgan et al. (2023) Exceptional Children", url: "https://journals.sagepub.com/doi/full/10.1177/00144029221109849" },
  { year: 2016, event: "Houston Chronicle investigative report — cap exposed", type: "media", src: "Houston Chronicle 'Denied' series", url: "https://www.houstonchronicle.com/denied/1/" },
  { year: 2017, event: "US Dept. of Education declares Texas in violation of IDEA", type: "federal", src: "USDE Monitoring Visit Letter (PDF)", url: "https://static.texastribune.org/media/documents/USDE_Sped_Report.pdf" },
  { year: 2018, event: "Gov. Abbott announces special ed improvement plan / Cap officially lifted", type: "policy", src: "TexERC Report (2025)", url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf" },
  { year: 2020, event: "COVID-19 — identification rates continue rising during remote learning", type: "event", src: "TexERC Report (2025), Finding 1", url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf" },
  { year: 2023, event: "Texas meets IDEA requirements for the first time in a decade", type: "federal", src: "OSEP 2024 Determination Letters", url: "https://sites.ed.gov/idea/idea-files/2024-determination-letters-on-state-implementation-of-idea/" },
  { year: 2024, event: "Special ed students surpass 857,000 / rate reaches 15.3%", type: "data", src: "TEA Enrollment 2024-25", url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enroll-2024-25.pdf" },
  { year: 2025, event: "HB2 signed — $200 million additional funding for special education", type: "policy", src: "TEA Annual Report 2025", url: "https://tea.texas.gov/about-tea/news-and-multimedia/annual-reports/annual-report-2025-0.pdf" },
];

const TAG_STYLES = {
  landmark: { bg: "#b5432a", label: "Landmark" },
  spillover: { bg: "#2c5d8a", label: "Spillover" },
  extension: { bg: "#3a6b4a", label: "Extension" },
  policy: { bg: "#8a8578", label: "Policy" },
  qualitative: { bg: "#c49a6c", label: "Qualitative" },
  comparison: { bg: "#6b5b8a", label: "Comparison" },
  labor: { bg: "#2c5d8a", label: "Labor" },
  fiscal: { bg: "#3a6b4a", label: "Fiscal" },
  data: { bg: "#8a8578", label: "Data" },
};

function UShapeChart() {
  const svgRef = useRef(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 20, bottom: 35, left: 42 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;
    const data = [
      { y: "00", v: 12.1 },{ y: "02", v: 11.8 },{ y: "04", v: 11.0 },
      { y: "06", v: 10.0 },{ y: "08", v: 9.2 },{ y: "10", v: 8.8 },
      { y: "12", v: 8.5 },{ y: "14", v: 8.5 },{ y: "16", v: 8.6 },
      { y: "18", v: 9.2 },{ y: "20", v: 10.7 },{ y: "22", v: 12.7 },
      { y: "24", v: 15.3 },
    ];
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x = d3.scalePoint().domain(data.map(d => d.y)).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([6, 17]).range([height, 0]);
    g.append("rect").attr("x", x("04")).attr("y", 0).attr("width", x("16") - x("04")).attr("height", height).attr("fill", COLORS.accent).attr("opacity", 0.06);
    g.append("line").attr("x1", 0).attr("x2", width).attr("y1", y(8.5)).attr("y2", y(8.5)).attr("stroke", COLORS.accent).attr("stroke-dasharray", "4,3").attr("opacity", 0.5);
    g.append("text").attr("x", x("10")).attr("y", y(8.5) + 14).attr("text-anchor", "middle").attr("font-size", 9).attr("fill", COLORS.accent).text("8.5% cap");
    const area = d3.area().x(d => x(d.y)).y0(height).y1(d => y(d.v)).curve(d3.curveCardinal.tension(0.4));
    g.append("path").datum(data).attr("d", area).attr("fill", COLORS.blue).attr("opacity", 0.1);
    const line = d3.line().x(d => x(d.y)).y(d => y(d.v)).curve(d3.curveCardinal.tension(0.4));
    g.append("path").datum(data).attr("d", line).attr("fill", "none").attr("stroke", COLORS.blue).attr("stroke-width", 2.5);
    g.selectAll(".dot").data(data).join("circle").attr("cx", d => x(d.y)).attr("cy", d => y(d.v)).attr("r", 3).attr("fill", COLORS.paper).attr("stroke", COLORS.blue).attr("stroke-width", 1.5);
    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickSize(0)).call(g => g.select(".domain").attr("stroke", COLORS.border)).selectAll("text").attr("fill", COLORS.muted).attr("font-size", 10).text(d => "'" + d);
    g.append("g").call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(d => d + "%")).call(g => g.select(".domain").remove()).call(g => g.selectAll(".tick line").attr("stroke", COLORS.border).attr("stroke-dasharray", "2,2")).selectAll("text").attr("fill", COLORS.muted).attr("font-size", 10);
  }, []);
  return <svg ref={svgRef} style={{ width: "100%", height: 220 }} />;
}

function PaperCard({ paper }) {
  const [expanded, setExpanded] = useState(false);
  const tagStyle = TAG_STYLES[paper.tag] || TAG_STYLES.policy;
  return (
    <div style={{
      background: "#fff", border: paper.isNew ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`, borderRadius: 4,
      padding: "18px 22px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1,
              background: tagStyle.bg, color: "#fff", padding: "2px 8px", borderRadius: 2,
              textTransform: "uppercase",
            }}>
              {tagStyle.label}
            </span>
            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: COLORS.muted }}>
              {paper.year}
            </span>
            <span style={{
              fontSize: 11, fontFamily: "'DM Mono', monospace", color: COLORS.blue,
              background: COLORS.blueLight, padding: "2px 8px", borderRadius: 2,
            }}>
              {paper.method}
            </span>
            {paper.isNew && (
              <span style={{
                fontSize: 9, fontFamily: "'DM Mono', monospace", letterSpacing: 1,
                background: "#b5432a", color: "#fff", padding: "2px 8px", borderRadius: 2,
                animation: "pulse 2s infinite",
              }}>
                NEW
              </span>
            )}
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5, marginBottom: 4 }}>
            {paper.title}
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>
            {paper.authors}
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, fontStyle: "italic" }}>
            {paper.journal}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            cursor: "pointer", fontSize: 12, color: COLORS.accent,
            fontFamily: "'DM Mono', monospace", letterSpacing: 0.5,
            userSelect: "none",
          }}
        >
          {expanded ? "▾ Collapse summary" : "▸ View summary"}
        </div>
        {expanded && (
          <div style={{
            marginTop: 10, padding: "12px 16px", background: COLORS.warmLight,
            borderRadius: 3, fontSize: 13, lineHeight: 1.8, color: COLORS.ink,
            borderLeft: `3px solid ${COLORS.warm}`,
          }}>
            {paper.summary}
          </div>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11, fontFamily: "'DM Mono', monospace", color: COLORS.blue,
            textDecoration: "none", letterSpacing: 0.5,
          }}
        >
          → Full text link
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [activeArea, setActiveArea] = useState(null);
  const [section, setSection] = useState("home");

  const totalPapers = AREAS_ORDER.reduce((sum, k) => sum + LITERATURE[k].papers.length, 0);

  return (
    <div style={{
      fontFamily: "'Noto Sans KR', 'Crimson Pro', Georgia, serif",
      background: COLORS.paper, color: COLORS.ink, minHeight: "100vh",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=DM+Mono:wght@300;400&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

      <header style={{
        borderBottom: `1px solid ${COLORS.ink}`, padding: "20px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLORS.accent, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
            Texas Special Education Cap
          </div>
          <div style={{ fontSize: 26, fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 300, letterSpacing: -0.5, lineHeight: 1.2 }}>
            Research Institute
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
            TSECRI — Literature-based policy analysis
          </div>
        </div>
        <nav style={{ display: "flex", gap: 24, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
          {[["home", "Overview"], ["research", "Literature"], ["timeline", "Timeline"], ["data", "Data"]].map(([key, label]) => (
            <span key={key} onClick={() => { setSection(key); setActiveArea(null); }}
              style={{
                cursor: "pointer", paddingBottom: 4, color: section === key ? COLORS.ink : COLORS.muted,
                borderBottom: section === key ? `2px solid ${COLORS.accent}` : "2px solid transparent",
                letterSpacing: 1, textTransform: "uppercase",
              }}>
              {label}
            </span>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 28px" }}>

        {section === "home" && (
          <div>
            <div style={{ borderLeft: `3px solid ${COLORS.accent}`, paddingLeft: 20, marginBottom: 40, maxWidth: 640 }}>
              <p style={{ fontSize: 20, fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 300, lineHeight: 1.6, fontStyle: "italic", margin: "0 0 12px" }}>
                From 2004 to 2017, Texas imposed an unofficial 8.5% cap on special education enrollment.
                This policy excluded tens of thousands of students with disabilities from the services they needed.
              </p>
              <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>
                This institute systematically curates academic research related to this policy, providing empirical
                literature from multiple perspectives including causal effects, equity, fiscal impacts, and teacher labor markets.
              </p>
            </div>

            <div style={{ marginBottom: 40 }}>
              <UShapeChart />
              <div style={{ textAlign: "center", fontSize: 11, color: COLORS.muted, fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
                Texas special education enrollment rate (%), 2000–2024
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: COLORS.muted, fontFamily: "'DM Mono', monospace", marginTop: 2, opacity: 0.7 }}>
                Source: TEA PEIMS; DeMatthews, Reyes, Shin & Hart (2025), TexERC Report
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginBottom: 40 }}>
              {[
                { n: `${AREAS_ORDER.length}`, l: "Research areas", c: COLORS.accent },
                { n: `${totalPapers}`, l: "Studies included", c: COLORS.blue },
                { n: "2019–2025", l: "Publication period", c: COLORS.green },
              ].map((d, i) => (
                <div key={i} style={{
                  padding: "16px 18px", background: "#fff", borderRadius: 4,
                  border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${d.c}`,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 500, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{d.n}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{d.l}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={() => setSection("research")}
                style={{
                  background: COLORS.ink, color: COLORS.paper, border: "none",
                  padding: "12px 32px", borderRadius: 3, cursor: "pointer",
                  fontSize: 13, fontFamily: "'DM Mono', monospace", letterSpacing: 2, textTransform: "uppercase",
                }}>
                Browse literature →
              </button>
            </div>
          </div>
        )}

        {section === "research" && !activeArea && (
          <div>
            <h2 style={{ fontSize: 22, fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 300, marginBottom: 8 }}>
              Literature by research area
            </h2>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 28, lineHeight: 1.6 }}>
              Select a research area to view related academic papers and reports with author, methodology, and summary details.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {AREAS_ORDER.map((key) => {
                const area = LITERATURE[key];
                return (
                  <div key={key} onClick={() => setActiveArea(key)}
                    style={{
                      display: "flex", gap: 20, padding: "20px 24px",
                      background: "#fff", border: `1px solid ${COLORS.border}`,
                      borderRadius: 4, cursor: "pointer", alignItems: "flex-start",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
                  >
                    <div style={{ fontSize: 28, fontFamily: "'Crimson Pro', serif", color: COLORS.accent, lineHeight: 1, minWidth: 36, textAlign: "center", marginTop: 2 }}>
                      {area.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 500 }}>{area.title}</span>
                        <span style={{ fontSize: 12, color: COLORS.muted }}>{area.subtitle}</span>
                      </div>
                      <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>
                        {area.desc.substring(0, 80)}...
                      </p>
                      <div style={{ marginTop: 8, fontSize: 10, color: COLORS.accent, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
                        {area.papers.length} PAPERS · {area.papers.filter(p => p.tag === "landmark").length > 0 ? "LANDMARK STUDY INCLUDED" : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {section === "research" && activeArea && (
          <div>
            <button onClick={() => setActiveArea(null)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, color: COLORS.muted, fontFamily: "'DM Mono', monospace",
                padding: 0, marginBottom: 20, letterSpacing: 1,
              }}>
              ← BACK TO ALL AREAS
            </button>

            {(() => {
              const area = LITERATURE[activeArea];
              return (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 6 }}>
                    <span style={{ fontSize: 32, color: COLORS.accent, fontFamily: "'Crimson Pro', serif" }}>{area.icon}</span>
                    <h2 style={{ fontSize: 24, fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 300, margin: 0 }}>
                      {area.title}
                    </h2>
                    <span style={{ fontSize: 13, color: COLORS.muted }}>{area.subtitle}</span>
                  </div>
                  <p style={{ fontSize: 14, color: COLORS.muted, marginBottom: 24, lineHeight: 1.7, maxWidth: 720 }}>
                    {area.desc}
                  </p>

                  <div style={{
                    fontSize: 11, textTransform: "uppercase", letterSpacing: 2,
                    color: COLORS.accent, fontFamily: "'DM Mono', monospace",
                    marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    {area.papers.length} studies
                  </div>

                  {area.papers.map((paper, i) => (
                    <PaperCard key={i} paper={paper} />
                  ))}
                </>
              );
            })()}
          </div>
        )}

        {section === "timeline" && (
          <div>
            <h2 style={{ fontSize: 22, fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 300, marginBottom: 28 }}>
              Policy timeline
            </h2>
            <div style={{ position: "relative", paddingLeft: 28 }}>
              <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 1, background: COLORS.border }} />
              {TIMELINE.map((item, i) => {
                const typeColor = { policy: COLORS.accent, media: COLORS.warm, federal: COLORS.blue, event: COLORS.muted, data: COLORS.green }[item.type];
                return (
                  <div key={i} style={{ marginBottom: 24, position: "relative" }}>
                    <div style={{ position: "absolute", left: -24, top: 4, width: 10, height: 10, borderRadius: "50%", background: typeColor, border: `2px solid ${COLORS.paper}` }} />
                    <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: typeColor, letterSpacing: 1, marginBottom: 2 }}>
                      {item.year}
                      <span style={{ marginLeft: 8, fontSize: 9, textTransform: "uppercase", letterSpacing: 2, opacity: 0.7 }}>{item.type}</span>
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.6 }}>{item.event}</div>
                    {item.src && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: COLORS.blue, textDecoration: "none", marginTop: 3, display: "inline-block", opacity: 0.8 }}>
                        ↗ {item.src}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap", fontSize: 11, fontFamily: "'DM Mono', monospace", color: COLORS.muted }}>
              {[["policy", COLORS.accent], ["media", COLORS.warm], ["federal", COLORS.blue], ["event", COLORS.muted], ["data", COLORS.green]].map(([label, color]) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {section === "data" && (() => {
          const DL = ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer"
              style={{ color: COLORS.blue, textDecoration: "none", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
              → {children}
            </a>
          );
          const SectionHead = ({ children }) => (
            <div style={{
              fontSize: 11, textTransform: "uppercase", letterSpacing: 2,
              color: COLORS.accent, fontFamily: "'DM Mono', monospace",
              marginBottom: 14, paddingBottom: 6, borderBottom: `1px solid ${COLORS.border}`,
            }}>{children}</div>
          );
          const Row = ({ name, desc, links }) => (
            <div style={{
              marginBottom: 14, padding: "12px 16px", background: "#fff",
              border: `1px solid ${COLORS.border}`, borderRadius: 4,
            }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: links?.length ? 8 : 0 }}>{desc}</div>
              {links?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {links.map((l, i) => <DL key={i} href={l.url}>{l.label}</DL>)}
                </div>
              )}
            </div>
          );
          return (
          <div>
            <h2 style={{ fontSize: 22, fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 300, marginBottom: 8 }}>
              Data sources & methodology
            </h2>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 28, lineHeight: 1.6 }}>
              A comprehensive listing of all data sources, official reports, federal data, and researcher pages available for Texas special education cap research.
            </p>

            <SectionHead>Texas state data — TEA / PEIMS</SectionHead>
            <Row name="TEA Reports & Data Portal" desc="Central hub for all Texas Education Agency reports and data, covering student performance, finances, staff, and enrollment trends."
              links={[
                { label: "TEA Reports & Data main", url: "https://tea.texas.gov/reports-and-data" },
                { label: "TEA Reports & Data Portal (detailed)", url: "https://tea.texas.gov/texas-schools/accountability/academic-accountability/performance-reporting/texas-education-agency-reports-and-data-portal" },
              ]} />
            <Row name="PEIMS Standard Reports" desc="Public Education Information Management System. District-, school-, and student-level administrative data across ~1,200 districts, K-12. Covers special education, enrollment, demographics, and finances."
              links={[
                { label: "PEIMS Standard Reports overview", url: "https://tea.texas.gov/reports-and-data/student-data/standard-reports/peims-standard-reports-overview" },
                { label: "PEIMS Standard Reports listing", url: "https://tea.texas.gov/reports-and-data/student-data/standard-reports/peims-standard-reports" },
                { label: "PEIMS Data Standards (technical docs)", url: "https://tea.texas.gov/reports-and-data/data-submission/peims/peims-data-standards" },
                { label: "PEIMS system overview", url: "https://tea.texas.gov/reports-and-data/data-submission/peims" },
                { label: "How to request PEIMS reports (pir@tea.texas.gov)", url: "https://tea.texas.gov/reports-and-data/student-data/standard-reports/requesting-peims-reports" },
              ]} />
            <Row name="TEA Special Education Reports" desc="District-level special education student counts by disability type. Available from 2012-13 through 2024-25."
              links={[
                { label: "Special Education Reports (PEIMS)", url: "https://rptsvr1.tea.texas.gov/adhocrpt/adser.html" },
                { label: "TEA Special Education Data & Reports main", url: "https://tea.texas.gov/academics/special-student-populations/special-education/data-and-reports" },
              ]} />
            <Row name="TEA Student Enrollment Reports" desc="Student enrollment by grade, gender, and race/ethnicity."
              links={[
                { label: "Student Enrollment Reports", url: "https://rptsvr1.tea.texas.gov/adhocrpt/adste.html" },
              ]} />
            <Row name="TEA Enrollment Trends (annual reports)" desc="Annual enrollment reports with 10-year trends. Detailed breakdowns by race, income, special education, and charter schools. PDF format."
              links={[
                { label: "Enrollment Trends main (all years, PDF)", url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enrollment-trends" },
                { label: "Enrollment 2024-25 (latest)", url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enroll-2024-25.pdf" },
                { label: "Enrollment 2023-24", url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enroll-2023-24.pdf" },
              ]} />
            <Row name="TEA Annual Report 2025" desc="857K special ed students, HB2 $8.5B education package, teacher preparation and retention strategies."
              links={[
                { label: "TEA Annual Report 2025 (PDF)", url: "https://tea.texas.gov/about-tea/news-and-multimedia/annual-reports/annual-report-2025-0.pdf" },
              ]} />
            <Row name="Results Driven Accountability (RDA)" desc="District-level special education performance monitoring data. Successor system to PBMAS. Downloadable."
              links={[
                { label: "RDA Data (within TEA Portal)", url: "https://tea.texas.gov/texas-schools/accountability/academic-accountability/performance-reporting/texas-education-agency-reports-and-data-portal" },
              ]} />
            <Row name="Texas Special Education Funding Weights" desc="Texas Commission on Special Education Funding materials. Special education fiscal trends and SSES status."
              links={[
                { label: "SPED Funding Weights 2021-2022 (PDF)", url: "https://tea.texas.gov/finance-and-grants/state-funding/sped-funding-weights-2021-2022.pdf" },
              ]} />

            <SectionHead>Texas research centers</SectionHead>
            <Row name="Texas Education Research Center (TexERC)" desc="UT Austin-based evaluation center. Provides linked student-teacher-school longitudinal data. Used in Ballis & Heath (2021), DeMatthews et al. (2025), and other key studies. Restricted access (researcher application required)."
              links={[
                { label: "TexERC homepage", url: "https://texaserc.utexas.edu/" },
                { label: "TexERC Texas Special Ed Report 2025 (PDF)", url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf" },
              ]} />
            <Row name="Texas Higher Education Coordinating Board (THECB)" desc="College enrollment and degree attainment data. Used in Ballis & Heath (2021) to track college enrollment of students who lost special education services."
              links={[
                { label: "THECB Data & Reports", url: "https://www.highered.texas.gov/data-reports/" },
              ]} />
            <Row name="Texas Workforce Commission (TWC)" desc="Labor market wage and employment data. Linked with TEA student records to analyze long-run labor market effects of the cap."
              links={[
                { label: "TWC Labor Market Information", url: "https://www.twc.texas.gov/programs/labor-market-information" },
              ]} />

            <SectionHead>Federal data — US Department of Education</SectionHead>
            <Row name="IDEA Section 618 Data Products" desc="Disability data submitted by each state under IDEA. Part B (ages 3-21), Part C (ages 0-2). CSV downloads available. 12 collection areas: child count, educational environments, exiting, discipline, personnel, dispute resolution, etc."
              links={[
                { label: "IDEA 618 main (ED.gov)", url: "https://sites.ed.gov/idea/data/" },
                { label: "IDEA 618 Data Products (Open Data Platform)", url: "https://data.ed.gov/dataset/idea-section-618-data-products" },
                { label: "State Level Data Files (CSV download)", url: "https://data.ed.gov/dataset/idea-section-618-data-products-state-level-data-files" },
                { label: "Static Tables — Part B", url: "https://www.ed.gov/idea-section-618-data-products-static-files" },
                { label: "Static Tables — Part C", url: "https://data.ed.gov/dataset/idea-section-618-data-products-static-tables-part-c" },
                { label: "Data Documentation (technical docs)", url: "https://data.ed.gov/documentation/idea-section-618-state-level-documentation" },
                { label: "46th Annual Report to Congress (2024)", url: "https://sites.ed.gov/idea/data/" },
              ]} />
            <Row name="IDEA State Determinations" desc="Federal evaluations of state-level IDEA implementation. Texas rated 'needs assistance' from 2017–2023, then 'meets requirements' in 2023-24."
              links={[
                { label: "2024 Determination Letters", url: "https://sites.ed.gov/idea/idea-files/2024-determination-letters-on-state-implementation-of-idea/" },
                { label: "SPP/APR Letters (Texas)", url: "https://sites.ed.gov/idea/spp-apr-letters?selected-category=sppapr-part-b&selected-year=&state=Texas" },
              ]} />
            <Row name="NAEP Data Explorer" desc="National Assessment of Educational Progress. 4th/8th grade reading and math achievement. Used in Morgan et al. (2023) for Texas vs. adjoining states comparison. N=300,460."
              links={[
                { label: "NAEP Data Explorer", url: "https://www.nationsreportcard.gov/ndecore/landing" },
                { label: "NAEP Student Groups guide", url: "https://nces.ed.gov/nationsreportcard/guides/groups.aspx" },
              ]} />
            <Row name="NCES Condition of Education — Students With Disabilities" desc="National-level special education student trends and status. State-level comparisons available."
              links={[
                { label: "COE — Students With Disabilities", url: "https://nces.ed.gov/programs/coe/indicator/cgg/students-with-disabilities" },
              ]} />
            <Row name="NCES Digest of Education Statistics" desc="Comprehensive national education statistics. Includes state-level special education participation rates."
              links={[
                { label: "Digest of Education Statistics", url: "https://nces.ed.gov/programs/digest/" },
              ]} />
            <Row name="ED Open Data Platform" desc="Federal Department of Education open data portal. Includes IDEA 618, College Scorecard, district boundaries, and more."
              links={[
                { label: "data.ed.gov main", url: "https://data.ed.gov/" },
              ]} />

            <SectionHead>Third-party data & monitoring</SectionHead>
            <Row name="KIDS COUNT Data Center (Annie E. Casey Foundation)" desc="Texas county-level special education student counts and percentages. Based on PEIMS data, re-aggregated at the county level."
              links={[
                { label: "Texas Special Education Students", url: "https://datacenter.aecf.org/data/tables/3816-special-education-students?loc=45&loct=2" },
              ]} />
            <Row name="The Advocacy Institute" desc="Nonprofit specializing in IDEA data analysis and monitoring. Tracks state-level graduation gaps, IDEA identification trends, and more."
              links={[
                { label: "Advocacy Institute Blog (IDEA data analysis)", url: "https://www.advocacyinstitute.org/blog/" },
              ]} />

            <SectionHead>Key policy & journalism sources</SectionHead>
            <Row name="Houston Chronicle — 'Denied' Series (2016)" desc="Brian Rosenthal's investigative series exposing how the 8.5% cap excluded tens of thousands of students with disabilities from services. The direct catalyst for lifting the cap."
              links={[
                { label: "Denied: Part 1", url: "https://www.houstonchronicle.com/denied/1/" },
              ]} />
            <Row name="US DOE Texas Monitoring Visit Letter (2017)" desc="OSEP's official notification of Texas's IDEA violation. The evidentiary basis for the failure-to-ensure-FAPE finding."
              links={[
                { label: "Texas Part B 2017 Monitoring Visit Letter (PDF)", url: "https://static.texastribune.org/media/documents/USDE_Sped_Report.pdf" },
              ]} />
            <Row name="Texas Tribune — Special Education Coverage" desc="Texas-focused education policy journalism. Covers post-cap developments, HB2, teacher certification issues, and more."
              links={[
                { label: "Texas Tribune Education", url: "https://www.texastribune.org/series/public-education/" },
              ]} />
            <Row name="Texas Policy Research — TEA 2025 Annual Report Analysis" desc="Analysis of key takeaways from the TEA 2025 Annual Report, including context from the 89th Texas Legislature education bills."
              links={[
                { label: "Key Takeaways from TEA 2025 Report", url: "https://www.texaspolicyresearch.com/key-takeaways-from-the-texas-education-agency-2025-annual-report/" },
              ]} />

            <SectionHead>Identification strategies used in literature</SectionHead>
            {[
              { name: "Difference-in-Differences (DID)", desc: "Ballis & Heath (2021) — Texas vs. adjoining states, before/after cap adoption. Exploits differential treatment intensity based on districts' pre-policy SE rates" },
              { name: "Instrumental Variables (IV)", desc: "Ballis & Heath (2021) — Uses cap exposure as an instrument for SE removal to estimate LATE for marginal participants" },
              { name: "Time-varying Effect Model", desc: "Morgan et al. (2023) — Estimates biennial time-varying disability identification effects of the cap over 2003–2017 using NAEP plausible values" },
              { name: "Qualitative Case Study", desc: "DeMatthews & Knight (2019) — Case-based analysis of policy compliance mechanisms at the school level and principals' ethical dilemmas" },
              { name: "Descriptive Longitudinal Analysis", desc: "TexERC Report (2025) — 20-year trend visualization, racial risk ratios, charter school comparisons, teacher attrition cohort tracking" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 13, lineHeight: 1.6, padding: "0 4px" }}>
                <span style={{ fontWeight: 500, minWidth: 240, color: COLORS.ink, flexShrink: 0 }}>{item.name}</span>
                <span style={{ color: COLORS.muted }}>{item.desc}</span>
              </div>
            ))}

            <div style={{ marginTop: 24 }} />
            <SectionHead>Key research groups & author pages</SectionHead>
            <Row name="Briana Ballis (UC Davis, Economics)" desc="Pioneer of causal inference research on the Texas cap's long-run effects. Published in AEJ: Economic Policy. DID+IV design. Extended to health-education linkages in 2024."
              links={[
                { label: "Ballis research page", url: "https://brianaballis.weebly.com/research.html" },
                { label: "EdWorkingPapers author page", url: "https://edworkingpapers.com/authors/briana-ballis" },
              ]} />
            <Row name="Katelyn Heath (Cornell, Economics)" desc="Co-researcher with Ballis. Analysis of spillover effects and disproportionality impacts."
              links={[]} />
            <Row name="David DeMatthews (UT Austin, Educational Leadership)" desc="Education leadership and policy perspective. Research on how the cap operated at the school level, charter school gaps, and voucher policy. Lead author of the TexERC 2025 report."
              links={[
                { label: "UT Austin Faculty Page", url: "https://education.utexas.edu/faculty/david_dematthews" },
              ]} />
            <Row name="David Knight (UT El Paso, Education Finance)" desc="Education finance and resource allocation equity. Developer of the data-for-social-justice framework. CERPS associate director."
              links={[
                { label: "CERPS, UT El Paso", url: "https://www.utep.edu/education/cerps/" },
              ]} />
            <Row name="Paul Morgan (Penn State, Education Policy)" desc="Research on disability identification disparities for racial and language minority students. NAEP-based cross-state comparison design. Published in Exceptional Children."
              links={[
                { label: "Exceptional Children paper", url: "https://journals.sagepub.com/doi/full/10.1177/00144029221109849" },
              ]} />
          </div>
          );
        })()}
      </main>

      <footer style={{
        borderTop: `1px solid ${COLORS.border}`, padding: "20px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 11, color: COLORS.muted, fontFamily: "'DM Mono', monospace",
      }}>
        <span>TSECRI — Texas Special Education Cap Research Institute</span>
        <span>Literature review · March 2026</span>
      </footer>
    </div>
  );
}
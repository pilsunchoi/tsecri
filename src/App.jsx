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
    subtitle: "인과효과 식별",
    icon: "⟁",
    desc: "DID, IV, Synthetic Control 등을 활용한 8.5% cap의 인과적 영향 분석. Texas cap은 준자연실험으로서 특수교육 서비스의 장기 효과를 식별할 수 있는 드문 기회를 제공합니다.",
    papers: [
      {
        authors: "Ballis, B. & Heath, K.",
        year: 2021,
        title: "The Long-Run Impacts of Special Education",
        journal: "American Economic Journal: Economic Policy, 13(4), 72–111",
        summary: "Texas cap을 활용한 핵심 연구. 227,000명의 5학년 특수교육 학생 코호트를 추적하여, cap으로 인해 서비스를 상실한 학생의 고등학교 졸업률이 51.9% 하락하고 대학 등록률이 37.9% 감소했음을 DID와 IV로 식별. 저소득·소수인종 학생에게 효과가 집중됨을 발견. 특수교육의 marginal participant에 대한 장기 편익이 Perry Preschool 수준에 비견됨을 시사.",
        method: "DID + IV",
        url: "https://www.aeaweb.org/articles?id=10.1257/pol.20190603",
        tag: "landmark",
      },
      {
        authors: "Ballis, B. & Heath, K.",
        year: 2021,
        title: "Direct and Spillover Effects of Limiting Minority Student Access to Special Education",
        journal: "EdWorkingPaper No. 21-364, Annenberg Institute at Brown University",
        summary: "흑인 학생의 disproportionality cap이 해당 학생의 고등학교 졸업 및 대학 진학에 미친 직접·간접 효과를 분석. 흑인 학생의 특수교육 과대식별(misclassification)을 줄이면 오히려 인종 간 성과 격차가 축소될 수 있음을 발견. 일반교육 흑인·히스패닉 학생의 졸업률과 대학 등록률도 약 0.5%p 하락하는 spillover effect 확인.",
        method: "DID",
        url: "https://edworkingpapers.com/ai21-364",
        tag: "spillover",
      },
      {
        authors: "Ballis, B.",
        year: 2024,
        title: "Early Life Health Conditions and Racial Gaps in Education",
        journal: "Working Paper 2024-016, Human Capital and Economic Opportunity Working Group",
        summary: "Texas 행정 데이터와 Medicaid Managed Care 전환을 활용하여, 영아기 건강 상태의 인종 간 격차가 이후 교육 성과(특수교육 식별 포함)에 미치는 장기 효과를 분석. Cap 연구의 확장으로, 건강-교육 연결고리에서의 인종 불평등 메커니즘을 탐구.",
        method: "IV (Medicaid MMC shift)",
        url: "https://edworkingpapers.com/authors/briana-ballis",
        tag: "extension",
      },
      {
        authors: "Ballis, B.",
        year: 2020,
        title: "Does Peer Motivation Impact Educational Investments? Evidence From DACA",
        journal: "EdWorkingPaper No. 20-333, Annenberg Institute at Brown University",
        summary: "DACA 도입이 미등록 청소년의 교육 투자를 증가시키고, 이것이 DACA 대상이 아닌 동료 학생에게도 긍정적 spillover를 미쳤음을 발견. 특수교육 cap 연구에서 발견된 spillover effect의 이론적 메커니즘(동료 효과)을 별도 맥락에서 검증한 연구.",
        method: "DID (LA administrative data)",
        url: "https://edworkingpapers.com/ai20-333",
        tag: "spillover",
      },
      {
        authors: "Antonovics, K., Black, S. E., Cullen, J. B. & Meiselman, A. Y.",
        year: 2022,
        title: "Patterns, Determinants, and Consequences of Ability Tracking: Evidence from Texas Public Schools",
        journal: "NBER Working Paper No. 30370",
        summary: "Texas 공립학교의 능력별 반편성(tracking)을 2011-2019 행정 데이터로 분석. 특수교육 배치가 능력별 분리의 핵심 축 중 하나임을 확인. Ballis & Heath(2021)를 인용하여 특수교육 배치의 장기 효과에 대한 비교 맥락 제공. 저성취 학생에 대한 tracking의 부정적 효과가 cap 기간 서비스 상실 효과와 유사한 메커니즘임을 시사.",
        method: "Administrative data analysis",
        url: "https://www.nber.org/papers/w30370",
        tag: "comparison",
      },
    ],
  },
  equity: {
    title: "Equity & disparities",
    subtitle: "형평성·인종 격차",
    icon: "◈",
    desc: "Cap이 인종·언어·소득 집단에 차별적으로 작용한 메커니즘과 장애유형 간 대체효과를 분석하는 연구들. PBMAS가 흑인·ELL 학생의 식별을 순차적으로 억제한 구조적 과정이 핵심 쟁점입니다.",
    papers: [
      {
        authors: "Morgan, P. L., Woods, A. D., Wang, Y. & Gloski, C. A.",
        year: 2023,
        title: "Texas Special Education Cap's Associations With Disability Identification Disparities of Racial and Language Minority Students",
        journal: "Exceptional Children, 89(2), 185–203",
        summary: "NAEP 4학년 데이터(N=300,460)에 시변효과 모델(time-varying effect model)을 적용. 2003-2017년 기간 Texas 학생과 인접주 학생을 비교하여, cap 도입 후 흑인·ELL 학생의 장애 식별 확률이 점진적으로 하락함을 확인. 개인 수준 학업 성취를 통제해도 과소식별이 유지되어, 성취도 차이가 아닌 정책적 억제가 원인임을 시사.",
        method: "Time-varying effect model + NAEP cross-state comparison",
        url: "https://journals.sagepub.com/doi/full/10.1177/00144029221109849",
        tag: "landmark",
      },
      {
        authors: "DeMatthews, D. E. & Knight, D. S.",
        year: 2019,
        title: "The Texas Special Education Cap: Exploration into the Statewide Delay and Denial of Support to Students with Disabilities",
        journal: "Education Policy Analysis Archives, 27(2)",
        summary: "PBMAS Indicator 10의 설계와 작동 메커니즘을 체계적으로 분석한 정책 연구. 학군 수준 데이터를 활용하여 8.5% threshold가 학군의 특수교육 식별 행태를 어떻게 변형시켰는지를 기술. 약 1,200개 Texas 학군의 반응 패턴과 TEA의 모니터링 체계의 구조적 결함을 문서화.",
        method: "Policy analysis + descriptive statistics",
        url: "https://epaa.asu.edu/index.php/epaa/article/view/3793",
        tag: "policy",
      },
      {
        authors: "DeMatthews, D. E. & Knight, D. S.",
        year: 2019,
        title: "Denying Special Education to Students in Need: A Case of Accountability, Compliance, and Fear in a Texas Elementary School",
        journal: "Journal of Cases in Educational Leadership, 22(1), 55–72",
        summary: "Cap이 학교 현장에서 어떻게 작동했는지를 사례 연구로 분석. 신임 교장이 교육감과 상급자로부터 특수교육 비율을 낮추라는 압력을 받는 과정을 기술하여, 정책이 학교 리더십의 윤리적 딜레마로 전환되는 메커니즘을 포착.",
        method: "Qualitative case study",
        url: "https://journals.sagepub.com/doi/full/10.1177/1555458918786988",
        tag: "qualitative",
      },
      {
        authors: "Farkas, G., Morgan, P. L., Hillemeier, M. M., Mitchell, C. & Woods, A. D.",
        year: 2020,
        title: "District-Level Achievement Gaps Explain Black and Hispanic Overrepresentation in Special Education",
        journal: "Exceptional Children, 86(4), 374–394",
        summary: "학군 수준 인종별 성취 격차가 특수교육 과대대표성을 설명하는지 분석. 학군 수준 교란변수(특히 인종별 성취 격차)를 통제하면 흑인·히스패닉 학생의 과대대표성이 사라짐을 발견. Texas cap의 disproportionality 정책이 실제 '과대식별'이 아닌 '성취 격차 반영'을 억제한 것일 수 있음을 시사하는 배경 연구.",
        method: "Merged administrative + civil rights data",
        url: "https://journals.sagepub.com/doi/abs/10.1177/0014402919893695",
        tag: "comparison",
      },
      {
        authors: "Elder, T., Figlio, D., Imberman, S. & Persico, C.",
        year: 2019,
        title: "School Segregation and Racial Gaps in Special Education Identification",
        journal: "NBER Working Paper No. 25829",
        summary: "학교 내 인종 구성이 장애 식별에 미치는 영향을 분석. 소수인종 학생이 주로 비백인 학교에 재학할 때 장애 식별 확률이 낮아짐을 발견. Texas의 인종별 disproportionality 지표가 학교 수준 인종 분리와 상호작용하는 메커니즘을 이해하는 데 중요한 비교 연구.",
        method: "Administrative data + school fixed effects",
        url: "https://www.nber.org/papers/w25829",
        tag: "comparison",
      },
    ],
  },
  postcap: {
    title: "Post-cap dynamics",
    subtitle: "Cap 해제 후 동태분석",
    icon: "↺",
    desc: "2016년 Houston Chronicle 보도, 2018년 연방 개입 이후의 급격한 등록 반등이 정상화인지 과잉식별인지, 그리고 COVID-19의 영향을 분석하는 연구 영역입니다.",
    papers: [
      {
        authors: "DeMatthews, D. E., Reyes, P., Shin, J. & Hart, T. D.",
        year: 2025,
        title: "Texas Special Education Report: 13 Takeaways for Texans",
        journal: "Texas Education Research Center (TexERC), UT Austin",
        summary: "2000-2024년 Texas 특수교육의 종합 현황 보고서. U자형 등록 패턴(12%→8.5%→15.3%), 자폐 학생 14배 증가(8,650→119,641명), 차터스쿨과 일반공립학교의 격차 확대(0.5%p→3.4%p), 특수교사 3년 내 이직률 39%, 부유한 학교와 저소득 학교 간 통합교육 격차 등 13개 핵심 발견을 정리.",
        method: "Descriptive longitudinal analysis",
        url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf",
        tag: "landmark",
      },
      {
        authors: "Knight, D. S. & DeMatthews, D. E.",
        year: 2020,
        title: "Expanding the Use of Educational Data for Social Justice: Lessons From the Texas Cap on Special Education",
        journal: "Journal of Research on Leadership Education, 15(2), 109–132",
        summary: "Cap 사례를 교훈으로, 교육 데이터가 사회정의 실현에 어떻게 활용될 수 있는지를 제안. IDEA 비준수를 식별하기 위한 3가지 핵심 지표를 제시하고, 'outlier' 학군(유사 학군 대비 현저히 낮은 특수교육 비율)의 식별 방법론을 소개.",
        method: "Policy analysis + data framework",
        url: "https://journals.sagepub.com/doi/10.1177/1942775118783710",
        tag: "policy",
      },
      {
        authors: "Hopkins, B. G., Strunk, K. O., Imberman, S. A. et al.",
        year: 2023,
        title: "Trends in Special Education Identification During the COVID-19 Pandemic: Evidence from Michigan",
        journal: "NBER Working Paper No. 31261",
        summary: "Michigan 데이터를 활용한 COVID-19 기간 특수교육 식별 추세 분석. 팬데믹 이후 특수교육 식별이 전국적으로 급증한 현상이 Texas만의 특수성인지 전국적 추세인지를 판별하는 데 활용 가능한 비교 연구.",
        method: "Event study + descriptive analysis",
        url: "https://www.nber.org/papers/w31261",
        tag: "comparison",
      },
      {
        authors: "Texas Education Agency",
        year: 2025,
        title: "Enrollment in Texas Public Schools, 2024-25",
        journal: "TEA Division of Research and Analysis, Document No. GE26 601 02",
        summary: "2014-15~2024-25 10년간 등록 추세. 특수교육 비율이 2014-15년 8.5%에서 2024-25년 15.3%로 상승한 구체적 수치 제공. 전체 등록 554만명, 인종·경제·프로그램별 세분화 데이터. 전국 4대 인구 주(TX, CA, NY, FL) 비교 포함.",
        method: "Administrative data report",
        url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enroll-2024-25.pdf",
        tag: "data",
      },
      {
        authors: "Advocacy Institute (Cortiella, C.)",
        year: 2024,
        title: "Number of IDEA-eligible Students Increases 3 Percent in 2024",
        journal: "Advocacy Institute Blog / IDEA Section 618 Data Analysis",
        summary: "2024년 IDEA 618 데이터 분석. 전국 특수교육 학생 819만명(3.8% 증가). Texas의 증가분(77,404명)이 전국 증가분의 27%를 차지. 2021-2025 사이 약 100만명 증가 추세가 지속되면 역사적으로 전례 없는 속도. 장애 유형별로는 자폐·다중장애·발달지연이 증가.",
        method: "Federal data analysis (IDEA 618)",
        url: "https://www.advocacyinstitute.org/blog/",
        tag: "data",
      },
    ],
  },
  fiscal: {
    title: "Fiscal & labor effects",
    subtitle: "재정·교사 노동시장",
    icon: "§",
    desc: "Cap 해제 후 특수교육 지출 급증이 학군 재정과 교사 수급에 미치는 영향. 특수교사 이직률 심화와 비자격 교사 확대 추세가 서비스 질에 미치는 피드백 루프가 핵심 쟁점입니다.",
    papers: [
      {
        authors: "DeMatthews, D. E., Knight, D. S. & Shin, J.",
        year: 2022,
        title: "The Principal-Teacher Churn: Understanding the Relationship Between Leadership Turnover and Teacher Attrition",
        journal: "Educational Administration Quarterly, 58(1), 73–109",
        summary: "교장 이직이 교사 이탈에 미치는 영향을 분석. 특수교육 교사의 높은 이직률(2019 코호트 3년 내 39%)의 구조적 원인 중 하나로 학교 리더십의 불안정성을 식별. 비자격 교사가 저소득·소수인종 학생이 많은 학교에 집중 배치되는 현상과 연계.",
        method: "Longitudinal administrative data analysis",
        url: "https://doi.org/10.1177/0013161X211051974",
        tag: "labor",
      },
      {
        authors: "Stock, W. & Schultz, G.",
        year: 2025,
        title: "Public Health Insurance and Special Education Enrollment",
        journal: "Economics of Education Review, 105(C)",
        summary: "공적 건강보험 확대가 특수교육 등록에 미치는 영향을 분석. Medicaid 확대가 장애 진단 접근성을 높여 특수교육 식별률을 변화시키는 메커니즘을 탐구. Cap 해제 후의 식별률 급등이 의료 접근성 변화와 얼마나 연관되는지를 이해하는 데 중요한 배경 연구.",
        method: "Quasi-experimental",
        url: "https://ideas.repec.org/a/eee/ecoedu/v105y2025ics0272775724001006.html",
        tag: "fiscal",
      },
      {
        authors: "Texas Education Agency",
        year: 2025,
        title: "TEA Annual Report 2025",
        journal: "Texas Education Agency Official Publication",
        summary: "2024-25학년도 현황: 특수교육 학생 857,000명+, 특수교육 지출 약 85억 달러+난독증 서비스 3.65억 달러. HB2를 통한 2억 달러 추가 배정. 다수 학군에서 주정부 배분액이 실제 서비스 비용에 미달(예: Austin ISD 1.7억 달러 지출 vs. 주정부 배분 9,660만 달러).",
        method: "Administrative data report",
        url: "https://tea.texas.gov/about-tea/news-and-multimedia/annual-reports/annual-report-2025-0.pdf",
        tag: "data",
      },
      {
        authors: "Knight, D. S., Candelaria, C. A., Sun, M. et al.",
        year: 2024,
        title: "Principal Retention and Turnover During the COVID-19 Era: Do Students Have Equitable Access to Stable School Leadership?",
        journal: "Center for the Study of Teaching and Learning, University of Washington",
        summary: "COVID-19 시기 교장 이직이 특수교육 서비스 안정성에 미치는 영향을 분석. 저소득·고소수인종 학교에서 교장 이직률이 높아 특수교육 프로그램의 연속성이 위협받음을 확인. Cap 해제 후 급증하는 특수교육 수요 속에서 학교 리더십 안정성의 중요성을 강조.",
        method: "Administrative data (multi-state)",
        url: "http://hdl.handle.net/1773/51017",
        tag: "labor",
      },
      {
        authors: "Phillips, C.",
        year: 2024,
        title: "Texas School Districts Lose $300 Million in Federal Special Education Funding",
        journal: "Texas Public Radio, Investigative Report",
        summary: "TEA의 부적절한 Medicaid 상환 코딩으로 Texas 학군들이 연방 특수교육 자금 3억 달러를 상실한 사실을 보도. Cap 기간의 불법 예산 삭감에 이어 cap 해제 후에도 재정 관리 실패가 지속되고 있음을 드러낸 탐사 보도.",
        method: "Investigative journalism",
        url: "https://www.tpr.org/education/2024-01-11/texas-school-districts-lose-300-million-in-federal-special-education-funding",
        tag: "fiscal",
      },
    ],
  },
  charter: {
    title: "Charter school selection",
    subtitle: "차터스쿨 선별효과",
    icon: "⊞",
    desc: "차터스쿨의 특수교육 학생 비율이 일반 공립학교 대비 현저히 낮은 현상의 원인과 영향을 분석. Cream-skimming vs. self-sorting 논쟁과 공립학교 부담 전가 문제가 핵심입니다.",
    papers: [
      {
        authors: "DeMatthews, D. E., Reyes, P., Shin, J. & Hart, T. D.",
        year: 2025,
        title: "Texas Special Education Report — Findings 11-13 (Charter Schools)",
        journal: "TexERC Report, UT Austin",
        summary: "일반 공립학교와 차터스쿨 간 특수교육 비율 격차가 2008년 0.5%p에서 2024년 3.4%p로 확대된 추세를 문서화. 상위 5대 CMO(KIPP, IDEA, Harmony 등)의 특수교육 비율이 주 평균을 크게 하회. 지적장애·정서장애·자폐 학생이 일반 공립학교에 집중되는 현상을 장애유형별로 분해.",
        method: "Descriptive trend analysis",
        url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf",
        tag: "landmark",
      },
      {
        authors: "Knight, D. S., Shin, J. & McMorris, C.",
        year: 2022,
        title: "Student Mobility between Charter and Traditional Public School Sectors: Assessing Enrollment Patterns among Major Charter Management Organizations in Texas",
        journal: "Education Sciences, 12(12), 915",
        summary: "Texas 4대 대형 차터 네트워크의 학생 이동 패턴을 분석. 차터스쿨이 특수교육 학생은 적게 받지만 저소득·ELL 학생은 더 많이 받음을 확인. 섹터 간 이동이 특수교육 등록 격차에 기여하나, 차터 네트워크별·학년별로 패턴이 상이하여 일률적 cream-skimming 판정은 곤란함을 시사.",
        method: "Administrative data (student-level transfers)",
        url: "https://www.mdpi.com/2227-7102/12/12/915",
        tag: "landmark",
      },
      {
        authors: "Knight, D. S. & Toenjes, L. A.",
        year: 2020,
        title: "Do Charter Schools Receive Their Fair Share of Funding? School Finance Equity for Charter and Traditional Public Schools",
        journal: "Education Policy Analysis Archives, 28",
        summary: "차터스쿨과 일반 공립학교 간의 재정 배분 형평성을 분석. 특수교육 학생 비율의 차이가 학교 유형별 비용 구조와 재정 수요에 어떤 영향을 미치는지를 탐구.",
        method: "School finance analysis",
        url: "https://epaa.asu.edu/index.php/epaa/article/view/4438",
        tag: "fiscal",
      },
      {
        authors: "DeMatthews, D. E., Hart, T. D. & Knight, D. S.",
        year: 2024,
        title: "Taxpayer-Funded Private School Vouchers and Market Failure: A Policy Scan and Review from 1869 to 2024",
        journal: "Education Policy Analysis Archives",
        summary: "Texas의 사립학교 바우처 추진이 특수교육 학생에게 미칠 잠재적 영향을 역사적 맥락에서 분석. 차터스쿨의 특수교육 회피 패턴이 바우처 제도 하에서 더 심화될 가능성을 경고.",
        method: "Historical policy analysis + literature review",
        url: "https://epaa.asu.edu/index.php/epaa/article/view/8164",
        tag: "policy",
      },
      {
        authors: "Duncheon, J., DeMatthews, D. E. & Smith, T.",
        year: 2024,
        title: "Cream Skimming in an Early College High School: A First-Year Principal's Dilemma in a High-Performing Campus",
        journal: "Journal of Cases in Educational Leadership, 27(2), 3–18",
        summary: "선택형 학교(Early College High School)에서 장애학생·ELL이 과소대표되는 현상을 신임 교장의 사례로 분석. 차터스쿨의 cream-skimming 논쟁과 동일한 메커니즘이 학군 내 선택형 프로그램에서도 작동함을 시사. 입학 과정의 구조적 배제와 리더의 윤리적 딜레마를 포착.",
        method: "Qualitative case study",
        url: "https://journals.sagepub.com/doi/full/10.1177/15554589231196780",
        tag: "qualitative",
      },
    ],
  },
};

const AREAS_ORDER = ["causal", "equity", "postcap", "fiscal", "charter"];

const TIMELINE = [
  { year: 2004, event: "TEA, PBMAS 도입 — 8.5% cap 시작", type: "policy", src: "DeMatthews & Knight (2019) EPAA", url: "https://epaa.asu.edu/index.php/epaa/article/view/3793" },
  { year: 2006, event: "ELL 학생 등록 성과지표 추가", type: "policy", src: "Morgan et al. (2023) Exceptional Children", url: "https://journals.sagepub.com/doi/full/10.1177/00144029221109849" },
  { year: 2016, event: "Houston Chronicle 탐사보도 — cap 폭로", type: "media", src: "Houston Chronicle 'Denied' series", url: "https://www.houstonchronicle.com/denied/1/" },
  { year: 2017, event: "연방 교육부, Texas IDEA 위반 선언", type: "federal", src: "USDE Monitoring Visit Letter (PDF)", url: "https://static.texastribune.org/media/documents/USDE_Sped_Report.pdf" },
  { year: 2018, event: "Gov. Abbott, 특수교육 개선 계획 선언 / Cap 공식 폐지", type: "policy", src: "TexERC Report (2025)", url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf" },
  { year: 2020, event: "COVID-19 — 비대면 수업 중에도 식별률 계속 상승", type: "event", src: "TexERC Report (2025), Finding 1", url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf" },
  { year: 2023, event: "Texas, IDEA 요건 충족 판정 (10년 만에 최초)", type: "federal", src: "OSEP 2024 Determination Letters", url: "https://sites.ed.gov/idea/idea-files/2024-determination-letters-on-state-implementation-of-idea/" },
  { year: 2024, event: "특수교육 학생 857,000명 돌파 / 비율 15.3%", type: "data", src: "TEA Enrollment 2024-25", url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enroll-2024-25.pdf" },
  { year: 2025, event: "HB2 서명 — 특수교육에 2억 달러 추가 배정", type: "policy", src: "TEA Annual Report 2025", url: "https://tea.texas.gov/about-tea/news-and-multimedia/annual-reports/annual-report-2025-0.pdf" },
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
          {expanded ? "▾ 요약 접기" : "▸ 연구 요약 보기"}
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
          → 원문 링크
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
                2004년부터 2017년까지, Texas는 특수교육 등록에 8.5%라는 비공식 상한선을 적용했습니다.
                이 정책은 수만 명의 장애 학생을 필요한 서비스에서 배제했습니다.
              </p>
              <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>
                본 연구소는 이 정책과 관련된 학술 연구를 체계적으로 정리하여, 인과효과·형평성·재정·교사 노동시장 등
                다각적 관점에서의 실증 분석 문헌을 제공합니다.
              </p>
            </div>

            <div style={{ marginBottom: 40 }}>
              <UShapeChart />
              <div style={{ textAlign: "center", fontSize: 11, color: COLORS.muted, fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
                Texas special education enrollment rate (%), 2000–2024
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginBottom: 40 }}>
              {[
                { n: `${AREAS_ORDER.length}`, l: "연구 영역", c: COLORS.accent },
                { n: `${totalPapers}`, l: "수록 문헌", c: COLORS.blue },
                { n: "2019–2025", l: "주요 발표 기간", c: COLORS.green },
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
              각 연구 영역을 선택하면 관련 학술 논문과 보고서를 저자·방법론·요약과 함께 확인할 수 있습니다.
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
              Texas 특수교육 cap 연구에 활용 가능한 모든 데이터 소스, 공식 보고서, 연방 데이터, 연구자 페이지를 정리했습니다.
            </p>

            <SectionHead>Texas state data — TEA / PEIMS</SectionHead>
            <Row name="TEA Reports & Data Portal" desc="Texas Education Agency의 모든 보고서·데이터 허브. 학생 성과, 재정, 교사, 등록 추세 등을 포괄."
              links={[
                { label: "TEA Reports & Data 메인", url: "https://tea.texas.gov/reports-and-data" },
                { label: "TEA Reports & Data Portal (상세)", url: "https://tea.texas.gov/texas-schools/accountability/academic-accountability/performance-reporting/texas-education-agency-reports-and-data-portal" },
              ]} />
            <Row name="PEIMS Standard Reports" desc="Public Education Information Management System. 학군·학교·학생 수준 행정 데이터. 약 1,200개 학군, K-12 전체. 특수교육, 등록, 인구통계, 재정 등."
              links={[
                { label: "PEIMS Standard Reports 개요", url: "https://tea.texas.gov/reports-and-data/student-data/standard-reports/peims-standard-reports-overview" },
                { label: "PEIMS Standard Reports 목록", url: "https://tea.texas.gov/reports-and-data/student-data/standard-reports/peims-standard-reports" },
                { label: "PEIMS Data Standards (기술 문서)", url: "https://tea.texas.gov/reports-and-data/data-submission/peims/peims-data-standards" },
                { label: "PEIMS 시스템 개요", url: "https://tea.texas.gov/reports-and-data/data-submission/peims" },
                { label: "PEIMS 보고서 요청 방법 (pir@tea.texas.gov)", url: "https://tea.texas.gov/reports-and-data/student-data/standard-reports/requesting-peims-reports" },
              ]} />
            <Row name="TEA Special Education Reports" desc="학군별 장애유형별 특수교육 학생 수. 2012-13~2024-25 제공."
              links={[
                { label: "Special Education Reports (PEIMS)", url: "https://rptsvr1.tea.texas.gov/adhocrpt/adser.html" },
                { label: "TEA Special Education Data & Reports 메인", url: "https://tea.texas.gov/academics/special-student-populations/special-education/data-and-reports" },
              ]} />
            <Row name="TEA Student Enrollment Reports" desc="학년, 성별, 인종/민족별 학생 등록 현황."
              links={[
                { label: "Student Enrollment Reports", url: "https://rptsvr1.tea.texas.gov/adhocrpt/adste.html" },
              ]} />
            <Row name="TEA Enrollment Trends (연간 보고서)" desc="10년 추세 포함 연간 등록 보고서. 인종, 소득, 특수교육, 차터스쿨 등 세부 분류. PDF."
              links={[
                { label: "Enrollment Trends 메인 (전 연도 PDF)", url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enrollment-trends" },
                { label: "Enrollment 2024-25 (최신)", url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enroll-2024-25.pdf" },
                { label: "Enrollment 2023-24", url: "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/enroll-2023-24.pdf" },
              ]} />
            <Row name="TEA Annual Report 2025" desc="857K 특수교육 학생, HB2 $8.5B 교육 패키지, 교사 준비·유지 전략 등 종합 현황."
              links={[
                { label: "TEA Annual Report 2025 (PDF)", url: "https://tea.texas.gov/about-tea/news-and-multimedia/annual-reports/annual-report-2025-0.pdf" },
              ]} />
            <Row name="Results Driven Accountability (RDA)" desc="학군별 특수교육 성과 모니터링 데이터. PBMAS의 후속 시스템. 다운로드 가능."
              links={[
                { label: "RDA Data (TEA Portal 내)", url: "https://tea.texas.gov/texas-schools/accountability/academic-accountability/performance-reporting/texas-education-agency-reports-and-data-portal" },
              ]} />
            <Row name="Texas Special Education Funding Weights" desc="Texas Commission on Special Education Funding 자료. 특수교육 재정 추세, SSES 현황."
              links={[
                { label: "SPED Funding Weights 2021-2022 (PDF)", url: "https://tea.texas.gov/finance-and-grants/state-funding/sped-funding-weights-2021-2022.pdf" },
              ]} />

            <SectionHead>Texas research centers</SectionHead>
            <Row name="Texas Education Research Center (TexERC)" desc="UT Austin 기반 평가센터. 학생-교사-학교 종단 연결 데이터 제공. Ballis & Heath(2021), DeMatthews et al.(2025) 등 핵심 연구에서 활용. 제한적 접근(연구자 신청 필요)."
              links={[
                { label: "TexERC 홈페이지", url: "https://texaserc.utexas.edu/" },
                { label: "TexERC Texas Special Ed Report 2025 (PDF)", url: "https://texaserc.utexas.edu/wp-content/uploads/2025/04/Texas_Special_Ed_Report_4.4.2025.pdf" },
              ]} />
            <Row name="Texas Higher Education Coordinating Board (THECB)" desc="대학 등록·학위 취득 데이터. Ballis & Heath(2021)에서 특수교육 서비스 상실 학생의 대학진학 추적에 활용."
              links={[
                { label: "THECB Data & Reports", url: "https://www.highered.texas.gov/data-reports/" },
              ]} />
            <Row name="Texas Workforce Commission (TWC)" desc="노동시장 임금·고용 데이터. TEA 학생 기록과 연결하여 cap의 장기 노동시장 효과 분석에 활용."
              links={[
                { label: "TWC Labor Market Information", url: "https://www.twc.texas.gov/programs/labor-market-information" },
              ]} />

            <SectionHead>Federal data — US Department of Education</SectionHead>
            <Row name="IDEA Section 618 Data Products" desc="IDEA에 의해 각 주가 제출하는 장애학생 데이터. Part B(3-21세), Part C(0-2세). CSV 다운로드 가능. 12개 수집 항목: child count, educational environments, exiting, discipline, personnel, dispute resolution 등."
              links={[
                { label: "IDEA 618 메인 (ED.gov)", url: "https://sites.ed.gov/idea/data/" },
                { label: "IDEA 618 Data Products (Open Data Platform)", url: "https://data.ed.gov/dataset/idea-section-618-data-products" },
                { label: "State Level Data Files (CSV 다운로드)", url: "https://data.ed.gov/dataset/idea-section-618-data-products-state-level-data-files" },
                { label: "Static Tables — Part B", url: "https://www.ed.gov/idea-section-618-data-products-static-files" },
                { label: "Static Tables — Part C", url: "https://data.ed.gov/dataset/idea-section-618-data-products-static-tables-part-c" },
                { label: "Data Documentation (기술 문서)", url: "https://data.ed.gov/documentation/idea-section-618-state-level-documentation" },
                { label: "46th Annual Report to Congress (2024)", url: "https://sites.ed.gov/idea/data/" },
              ]} />
            <Row name="IDEA State Determinations" desc="연방 교육부의 주별 IDEA 이행 평가 결과. Texas는 2017-2023년 'needs assistance' → 2023-24년 'meets requirements' 획득."
              links={[
                { label: "2024 Determination Letters", url: "https://sites.ed.gov/idea/idea-files/2024-determination-letters-on-state-implementation-of-idea/" },
                { label: "SPP/APR Letters (Texas)", url: "https://sites.ed.gov/idea/spp-apr-letters?selected-category=sppapr-part-b&selected-year=&state=Texas" },
              ]} />
            <Row name="NAEP Data Explorer" desc="National Assessment of Educational Progress. 4·8학년 읽기/수학 성취도. Morgan et al.(2023)에서 Texas vs. 인접주 비교에 활용. N=300,460."
              links={[
                { label: "NAEP Data Explorer", url: "https://www.nationsreportcard.gov/ndecore/landing" },
                { label: "NAEP Student Groups 설명", url: "https://nces.ed.gov/nationsreportcard/guides/groups.aspx" },
              ]} />
            <Row name="NCES Condition of Education — Students With Disabilities" desc="전국 수준 특수교육 학생 현황 및 추세. 주별 비교 가능."
              links={[
                { label: "COE — Students With Disabilities", url: "https://nces.ed.gov/programs/coe/indicator/cgg/students-with-disabilities" },
              ]} />
            <Row name="NCES Digest of Education Statistics" desc="전국 교육 통계 종합. 특수교육 참여율 주별 비교 포함."
              links={[
                { label: "Digest of Education Statistics", url: "https://nces.ed.gov/programs/digest/" },
              ]} />
            <Row name="ED Open Data Platform" desc="연방 교육부 오픈 데이터 포털. IDEA 618 외에도 College Scorecard, 학군 경계 등 제공."
              links={[
                { label: "data.ed.gov 메인", url: "https://data.ed.gov/" },
              ]} />

            <SectionHead>Third-party data & monitoring</SectionHead>
            <Row name="KIDS COUNT Data Center (Annie E. Casey Foundation)" desc="Texas 카운티별 특수교육 학생 수·비율. PEIMS 기반이나 카운티 단위로 재집계."
              links={[
                { label: "Texas Special Education Students", url: "https://datacenter.aecf.org/data/tables/3816-special-education-students?loc=45&loct=2" },
              ]} />
            <Row name="The Advocacy Institute" desc="IDEA 데이터 분석·모니터링 전문 비영리. 주별 졸업률 격차, IDEA 식별 추세 등 정리."
              links={[
                { label: "Advocacy Institute Blog (IDEA data analysis)", url: "https://www.advocacyinstitute.org/blog/" },
              ]} />

            <SectionHead>Key policy & journalism sources</SectionHead>
            <Row name="Houston Chronicle — 'Denied' Series (2016)" desc="Brian Rosenthal의 탐사보도. 8.5% cap이 수만 명의 장애학생을 서비스에서 배제한 실태를 폭로. Cap 해제의 직접적 계기."
              links={[
                { label: "Denied: Part 1", url: "https://www.houstonchronicle.com/denied/1/" },
              ]} />
            <Row name="US DOE Texas Monitoring Visit Letter (2017)" desc="OSEP의 Texas IDEA 위반 공식 통보서. FAPE 미보장 판정 근거 문서."
              links={[
                { label: "Texas Part B 2017 Monitoring Visit Letter (PDF)", url: "https://static.texastribune.org/media/documents/USDE_Sped_Report.pdf" },
              ]} />
            <Row name="Texas Tribune — Special Education Coverage" desc="Texas 교육 정책 전문 저널리즘. Cap 후속 보도, HB2, 교사 자격 문제 등."
              links={[
                { label: "Texas Tribune Education", url: "https://www.texastribune.org/series/public-education/" },
              ]} />
            <Row name="Texas Policy Research — TEA 2025 Annual Report Analysis" desc="TEA 2025 연례보고서의 핵심 시사점 분석. 89대 Texas 의회 교육 법안 맥락 포함."
              links={[
                { label: "Key Takeaways from TEA 2025 Report", url: "https://www.texaspolicyresearch.com/key-takeaways-from-the-texas-education-agency-2025-annual-report/" },
              ]} />

            <SectionHead>Identification strategies used in literature</SectionHead>
            {[
              { name: "Difference-in-Differences (DID)", desc: "Ballis & Heath(2021) — Texas vs. 인접주, cap 도입 전후 비교. 학군의 pre-policy SE rate에 따른 차별적 처치 강도 활용" },
              { name: "Instrumental Variables (IV)", desc: "Ballis & Heath(2021) — cap 노출을 SE removal의 도구변수로 사용하여 marginal participant에 대한 LATE 추정" },
              { name: "Time-varying Effect Model", desc: "Morgan et al.(2023) — 2003-2017 기간 cap의 시변적 장애식별 영향을 격년 단위로 추정. NAEP plausible values 활용" },
              { name: "Qualitative Case Study", desc: "DeMatthews & Knight(2019) — 학교 현장의 정책 순응 메커니즘과 교장의 윤리적 딜레마를 사례 분석" },
              { name: "Descriptive Longitudinal Analysis", desc: "TexERC Report(2025) — 20년간 추세 시각화, 인종별 risk ratio, 차터스쿨 비교, 교사 이직률 코호트 추적" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 13, lineHeight: 1.6, padding: "0 4px" }}>
                <span style={{ fontWeight: 500, minWidth: 240, color: COLORS.ink, flexShrink: 0 }}>{item.name}</span>
                <span style={{ color: COLORS.muted }}>{item.desc}</span>
              </div>
            ))}

            <div style={{ marginTop: 24 }} />
            <SectionHead>Key research groups & author pages</SectionHead>
            <Row name="Briana Ballis (UC Davis, Economics)" desc="Texas cap 장기효과 연구의 선구자. AEJ: Economic Policy 게재. DID+IV 설계. 2024년 건강-교육 연결 확장 연구."
              links={[
                { label: "Ballis 연구 페이지", url: "https://brianaballis.weebly.com/research.html" },
                { label: "EdWorkingPapers 저자 페이지", url: "https://edworkingpapers.com/authors/briana-ballis" },
              ]} />
            <Row name="Katelyn Heath (Cornell, Economics)" desc="Ballis와 공동 연구. Spillover effect, disproportionality 효과 분석."
              links={[]} />
            <Row name="David DeMatthews (UT Austin, Educational Leadership)" desc="교육 리더십·정책 관점. Cap의 학교 현장 작동 메커니즘, 차터스쿨 격차, 바우처 연구. TexERC 2025 보고서 주저자."
              links={[
                { label: "UT Austin Faculty Page", url: "https://education.utexas.edu/faculty/david_dematthews" },
              ]} />
            <Row name="David Knight (UT El Paso, Education Finance)" desc="교육재정·자원배분 형평성. 데이터 활용 사회정의 프레임워크 개발. CERPS 부소장."
              links={[
                { label: "CERPS, UT El Paso", url: "https://www.utep.edu/education/cerps/" },
              ]} />
            <Row name="Paul Morgan (Penn State, Education Policy)" desc="인종·언어 소수자의 장애식별 격차 연구. NAEP 기반 cross-state comparison. Exceptional Children 게재."
              links={[
                { label: "Exceptional Children 논문", url: "https://journals.sagepub.com/doi/full/10.1177/00144029221109849" },
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

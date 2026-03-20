# TSECRI — Texas Special Education Cap Research Institute

Texas 8.5% special education cap (2004–2017) 관련 학술 연구를 체계적으로 정리한 온라인 연구소.

## 구조

```
tsecri/
├── src/
│   ├── App.jsx          # 메인 앱 (Literature, Timeline, Data 포함)
│   └── main.jsx         # React entry point
├── index.html
├── vite.config.js       # base path 설정 (GitHub Pages용)
├── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml   # 자동 배포 워크플로우
└── README.md
```

## 배포 방법

### 1단계: GitHub 리포 생성 & 푸시

```bash
cd tsecri
git init
git add .
git commit -m "Initial: TSECRI Research Institute"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tsecri.git
git push -u origin main
```

### 2단계: GitHub Pages 활성화

1. GitHub → 리포 Settings → Pages
2. Source: **GitHub Actions** 선택 (기존 branch 방식이 아님)
3. push하면 자동으로 `.github/workflows/deploy.yml`이 실행됨

### 3단계: 접속

```
https://YOUR_USERNAME.github.io/tsecri/
```

## base path 변경

기존 dashboards 리포에 하위 경로로 넣고 싶다면:

```js
// vite.config.js
base: '/dashboards/tsecri/'
```

## 콘텐츠 업데이트

`src/App.jsx`의 `LITERATURE` 객체에 논문을 추가하면 됩니다:

```js
{
  authors: "저자명",
  year: 2025,
  title: "논문 제목",
  journal: "게재지",
  summary: "한국어 요약",
  method: "연구 방법론",
  url: "https://...",
  tag: "landmark",  // landmark | policy | comparison | qualitative | spillover | ...
}
```

새 논문에 NEW 뱃지를 표시하려면 `isNew: true` 필드를 추가하세요.
PaperCard 컴포넌트에서 이를 감지하여 표시합니다.

## 향후 자동화 (Option A 메모)

매월 자동 업데이트를 위한 GitHub Actions cron + Claude API 파이프라인은
추후 `.github/workflows/monthly-update.yml`로 추가 예정.

```yaml
on:
  schedule:
    - cron: '0 9 1 * *'  # 매월 1일 오전 9시 (UTC)
```

## 수록 현황

| 영역 | 논문 수 |
|------|---------|
| Causal identification | 5 |
| Equity & disparities | 5 |
| Post-cap dynamics | 5 |
| Fiscal & labor effects | 5 |
| Charter school selection | 5 |
| **합계** | **25** |

## 라이선스

연구 목적 공개 자료. 수록된 논문의 저작권은 각 저자 및 출판사에 귀속됩니다.

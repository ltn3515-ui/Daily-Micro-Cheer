# Daily Micro-Cheer — Apps in Toss Product

- Category: NON_GAME / UTILITY / WELLNESS
- Decision: GO (MVP)
- Core Value: 앱 진입 즉시 10초 안에 따뜻한 칭찬 또는 다정한 팩폭을 텍스트와 음성으로 제공
- Login: 없음
- Personal data: 수집하지 않음
- Backend: MVP 없음
- Monetization: MVP 없음. 리텐션 검증 후 결과 전환 지점 광고를 별도 검토
- Retention: 날짜별 기본 한마디 + 추가 랜덤 한마디 + 좋아요(localStorage)
- Voice: Web Speech API speechSynthesis 기반. Apps in Toss Sandbox/실기기 호환성 확인 전까지 experimental 처리

## Product flow
Open → Daily cheer → Voice(optional) → More cheer → Favorite → Return

## MVP analytics plan
miniapp_open / core_action_complete / voice_play / next_cheer / favorite / return_visit

## Policy notes
- AI 생성 결과를 실시간 제공하지 않는 큐레이션형 MVP로 시작해 생성형 AI 고지/비용을 피한다.
- 향후 AI가 실시간 문구를 생성하면 최초 이용 고지 + AI 생성 결과 라벨을 추가해야 한다.
- 같은 핵심 기능을 테마만 바꿔 여러 앱으로 복제하지 않는다.

# Frontend rules (project conventions)

## Naming strategy (summary)
- **Exist → noun**
- **Action → verbNoun**
- **State → nounSlice**
- **Logic → verbNounSaga**
- **Hook → useVerbNoun**
- **UI → nounType / nounScreen / nounPanel / nounCard**

## Polling
- Use a hook (`usePollNifty`) to manage polling lifecycle.
- Avoid unnecessary calls:
  - pause on `document.visibilityState !== 'visible'`
  - avoid overlap while request is in-flight

## Response shape
- Backend response keys are kept as-is from NSE payload for minimal mapping.


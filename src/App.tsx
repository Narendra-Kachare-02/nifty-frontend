import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import { Loading } from './common/components'
import { BrowserRouter } from "react-router"
import { Core } from './core'
import { ThemeProvider } from './common/context/ThemeContext'

function App() {
  return (
    <StrictMode>
      <ThemeProvider>
        <Provider store={store}>
          <PersistGate loading={<Loading />} persistor={persistor}>
            <BrowserRouter>
              <Core />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
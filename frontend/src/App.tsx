import './App.css'
import LandingPage from './pages/landingpage'
import Button from './components/ui/button'

function App() {

  return (
    <>
      <div className="overflow-y-auto">
        <LandingPage/>
        <Button variant="primary" title="ClickmeDaddy" size="md" text="ClickMe"/>
      </div>
    </>
  )
}

export default App

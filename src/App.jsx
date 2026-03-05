import Footer from "./components/Footer"
import Navigation from "./components/Navigation"
import MainContent from "./pages/MainContent"



function App() {

  return (
    <>
    {console.log(import.meta.env.VITE_API_URL)}
      <div className="">
        <Navigation />
        <MainContent />
        <Footer />
      </div>
    </>
  )
}

export default App

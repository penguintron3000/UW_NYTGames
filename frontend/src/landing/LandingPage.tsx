import "./LandingPage.css"
import Card from 'react-bootstrap/Card';
import { isMobile, isTablet } from "react-device-detect";
import turkey from '../assets/turkey.gif'
import Header from "../header/Header";
import { useDarkMode } from "../header/contexts/useDarkMode";

function LandingPage() {

  const {isDarkMode} = useDarkMode();

  // Remove scroll bar on landing page
  document.body.style.overflow = "hidden"

  if(isMobile && !isTablet){
    document.body.style.zoom = "50%";
}
//style={{ backgroundImage: `url(${bg})`, backgroundSize:'cover' } background
  return (
    <div id = "LandingPage" style={{height: '200vh', width:"100%", fontFamily:'Arial', backgroundColor: isDarkMode ?'#20211A' : '' }}>
        <h1 id = "title" style={{ display: "inline-block", width: "100%", color: !isDarkMode ?'#20211A' : '#FAF9F6'}}>Welcome To Epic NYT Games! <div id = "team5">By Team 5</div></h1>
        <h2 id = "subheader" style={{ display: "inline-block", width: "100%", color: !isDarkMode ?'#20211A' : '#FAF9F6'}}>Choose A Game To Play</h2>
        <div id = "cards">
          <a href = "/wordle">
            <Card className="card" id = "Wordle">
              <h1 style={{color: !isDarkMode ?'#20211A' : '#FAF9F6'}}>Wordle</h1>
            </Card>
          </a>
          <a href = "/connections">
            <Card className="card" id = "Connections" style={{backgroundColor:isDarkMode ? '#5bbef3' : '#8fd3f8'}}>
              <h1 style={{color: !isDarkMode ?'#20211A' : '#FAF9F6'}}>Connections</h1>
            </Card>
          </a>
        </div>
    </div>
  )
}

export default LandingPage
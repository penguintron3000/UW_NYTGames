import ConnectionsGrid from './components/ConnectionsGrid';
import logo from '../assets/LOGO.png'
import './ConnectionsPage.css';
import { isMobile, isTablet } from 'react-device-detect';
import ConnectionsAttempts from './components/ConnectionsAttempts';
import ConnectionsSubmit from './components/ConnectionsSubmit';
import Modal from 'react-modal';
import { useConnectionsGameContext } from './contexts/ConnectionsGameContext';
import { useDarkMode } from '../header/contexts/useDarkMode';

function ConnectionsPage(){

    const {modalStatus, modalMessage, setModalStatusFalse} = useConnectionsGameContext();
    const {isDarkMode} = useDarkMode();

    if(isMobile && !isTablet){
        document.body.style.zoom = "40%";
    }

    return <div id = "ConnectionsPage" style={{backgroundColor: isDarkMode ? "#20211A" : "", height:"300vh", width:"100%"}}>
        <br></br>
        <h1 id = "header" style={{ display: "inline-block", width: "100%", color: isDarkMode ? "#FAF9F6" : "#20211A", fontFamily: "Arial" }}>Connections</h1>
        <div onClick = {setModalStatusFalse}>
            <Modal style={{
                content:{fontFamily: "Arial", backgroundColor: isDarkMode ? "#20211A" : "white", color: !isDarkMode ?'#20211A' : '#FAF9F6', borderColor: !isDarkMode ? 'black' : "white"},
                }} 
                isOpen = {modalStatus} id = "modalConnections" ariaHideApp = {false}>
                    <div id = "Message">{modalMessage}</div>
            </Modal>
        </div>
        <div id = "connectionsComponents">
            <ConnectionsGrid/>
            <ConnectionsAttempts/>
            <ConnectionsSubmit/>
        </div>
    </div>;
}

export default ConnectionsPage;
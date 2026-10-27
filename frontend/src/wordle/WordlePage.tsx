import React from 'react';
import { useWordleGameContext } from './contexts/WordleGameContext';
import WordleGrid from './components/WordleGrid';
import WordleKeyboard from './components/WordleKeyboard';
import logo from '../assets/LOGO.png'
import './WordlePage.css';
import Modal from 'react-modal';
import WordleStats from './components/WordleStats';
import { isMobile, isTablet } from 'react-device-detect';
import { useDarkMode } from '../header/contexts/useDarkMode';

function WordlePage() {

    const { guesses, colors, handleGameEvent, modalMessage, modalStatus, setModalStatusFalse, takingInput } = useWordleGameContext();
    const { isDarkMode } = useDarkMode();
 
    const keyPressed = React.useCallback(handleGameEvent, [colors, guesses]);

    // Add event listener for key presses
    React.useEffect(() => {
        document.addEventListener("keydown", keyPressed, false);
        return () => {
            document.removeEventListener("keydown", keyPressed, false);
        };
    }, [keyPressed]);

    if(isMobile && !isTablet){
        document.body.style.zoom = "50%";
    }
    if(isTablet){
        document.body.style.paddingBottom = "150px";
    }
    //style={{ backgroundImage: `url(${bg})`, backgroundSize:'cover' } background
    return (
        <div id = "WordlePage" onClick = {setModalStatusFalse} style={{backgroundColor: isDarkMode ?'#20211A' : '#FAF9F6', height: "200vh", width: "100%"}}>
            <Modal style={{
                content:{fontFamily: "Arial", backgroundColor: isDarkMode ? "#20211A" : "white", color: !isDarkMode ?'#20211A' : '#FAF9F6', borderColor: !isDarkMode ? 'black' : "white"},
                }} 
                isOpen = {modalStatus} id = "Modal" ariaHideApp = {false}>
                <div id = "Message">{modalMessage}</div>
                { !takingInput ? 
                <>
                <hr></hr>
                <WordleStats />
                </>
                : null }
            </Modal>
            <br></br>
            <h1 id = "header" style={{ display: "inline-block", width: "100%", fontFamily: "Arial", color: isDarkMode ? '#FAF9F6' : '#20211A' }}>Wordle</h1>
            <WordleGrid />
            <WordleKeyboard/ >
        </div>
    );
}

export default WordlePage;
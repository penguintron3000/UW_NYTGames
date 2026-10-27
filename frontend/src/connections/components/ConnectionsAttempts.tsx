import { useDarkMode } from "../../header/contexts/useDarkMode";
import { useConnectionsGameContext } from "../contexts/ConnectionsGameContext";

function ConnectionsAttempts(){

    const { attemptsCount } = useConnectionsGameContext();
    const { isDarkMode } = useDarkMode();
    var keyCount = 0;

    return <div id = "attempts" aria-label="attempts-bar">
        <div id = "attemptsText" style={{color: isDarkMode ? "#FAF9F6" : "#20211A", fontFamily: "Arial" }}>Attempts Left: </div>
        {attemptsCount.map((attempt) =>{
            keyCount++;
            return(
                attempt ? <div key={keyCount} style={{borderColor: isDarkMode ? "#FAF9F6" : "#20211A" }} className="vAttempt"></div> : <div key={keyCount} className="invAttempt"></div>
        )}
            )}
    </div>
}

export default ConnectionsAttempts;
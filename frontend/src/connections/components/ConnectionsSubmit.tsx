import { useDarkMode } from "../../header/contexts/useDarkMode";
import { useConnectionsGameContext } from "../contexts/ConnectionsGameContext";

function ConnectionsSubmit(){

    const { handleSubmit } = useConnectionsGameContext();
    const { isDarkMode } = useDarkMode();

    return <div id = "submitBody">
            <div id= "submitButton" style={{fontFamily: "Arial", color: isDarkMode ? "#FAF9F6" : "#20211A", borderColor: isDarkMode ? "#FAF9F6" : "#20211A" }} onClick={handleSubmit}>Submit</div>
        </div>
}

export default ConnectionsSubmit;
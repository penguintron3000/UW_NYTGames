import {useState} from "react";
import {useConnectionsGameContext} from "../contexts/ConnectionsGameContext";

function ConnectionsPhrase(props: {phraseText: string}){

    const { selectedCards, setSelectedCards, attemptsCount, validatedCards } = useConnectionsGameContext();
    const {phraseText} = props;
    const [status, setStatus] = useState("empty");

    function fontSize(str: string): string{
        let size = 30
        const scalingFactor = Math.max(1 - str.length / size, 0.5); // Minimum font size is 50%
        return `${32 * scalingFactor}px`;
    }

    function changeStatus(){
        if(validatedCards.get(phraseText) && validatedCards.get(phraseText) != ""){
            return;
        }

        if (attemptsCount.every((attempt) => attempt === false)){
            return;
        }

        if(status === "empty" && selectedCards.length < 4){
            setSelectedCards([...selectedCards, phraseText]);
            setStatus("clicked");
        }
        else{
            setSelectedCards(selectedCards.filter((card) => card !== phraseText));
            setStatus("empty");
        }
    }

    return <div style = {{fontSize: fontSize(phraseText.includes("bigger")
        ? phraseText.substring(0, phraseText.indexOf("bigger") - 1)
        : phraseText)}} className={`${"phrase"} ${validatedCards.get(phraseText) ? validatedCards.get(phraseText) : status}`} onClick = {()=>changeStatus()}>
        <div style={{fontFamily: "Arial"}} className = {validatedCards.get(phraseText) && validatedCards.get(phraseText) != "smaller" && validatedCards.get(phraseText) != "bigger" ? "lowerText" : "nothing"}>{phraseText}</div>
    </div>
    
}

export default ConnectionsPhrase;
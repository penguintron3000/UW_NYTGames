import ConnectionsPhrase from "./ConnectionsPhrase";
import { useConnectionsGameContext } from "../contexts/ConnectionsGameContext";

function ConnectionsGrid(){

    const { cards, topics } = useConnectionsGameContext();

    //that huge chunk from line 13 to 19 is adding/removing css animation depending on name given
    //and has that nested if operator to remove the " bigger" part of the name if it is present
    return (
      <div id="ConnectionsBoard">
        {Array.from({ length: 4 }, (_, rowIndex) => (
          <div key={rowIndex}>
            <div style={{fontFamily: "Arial", fontSize:32}} className={`${"topics"} ${topics[rowIndex].includes("bigger") ? "bigger" : "nothing"}`}>{
                topics[rowIndex] === "" 
                  ? <div className="filler"></div>
                  : topics[rowIndex].includes("bigger")
                    ? topics[rowIndex].substring(0, topics[rowIndex].indexOf("bigger") - 1)
                    : topics[rowIndex]
              }</div>
            <div className="rowConnections" id={"rowC" + rowIndex}>
              {cards.slice(rowIndex * 4, rowIndex * 4 + 4).map((card) => (
                <ConnectionsPhrase key={card} phraseText={card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  }

export default ConnectionsGrid;
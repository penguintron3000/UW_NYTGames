import WordleLetter from "./WordleLetter";
import { useWordleGameContext } from "../contexts/WordleGameContext";

function WordleGrid() {

    const { guesses, colors } = useWordleGameContext();

    return (
        <div className="board">
            {guesses.map((row, rowIndex) => (
                <div className="row" key={rowIndex} aria-label={`board-row-${rowIndex}`}>
                    {[0, 1, 2, 3, 4].map((colIndex) => (
                        <WordleLetter
                            key={colIndex}
                            letter={row[colIndex]}
                            letterId={row[5] === "no" && row[colIndex] != "" ? "flip" : colors[rowIndex][colIndex]}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default WordleGrid;
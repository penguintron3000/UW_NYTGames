import { useWordleGameContext } from '../contexts/WordleGameContext';

function WordleKeyboard(){

    const keyboardLetters = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "DEL"], ["A", "S", "D", "F", "G", "H", "J", "K", "L", "RET"], ["Z", "X", "C", "V", "B", "N", "M"]];
    let rowNum = 0;

    const {handleGameEvent, colorMap} = useWordleGameContext();

    return (
        <div id = "keyboard">
            {keyboardLetters.map(m => {
                rowNum++;
                return (
                    <div key={rowNum} className={`${"row" + rowNum} ${"keyboardRow"}`}>
                        {m.map(k => (
                            <div aria-label={`keyboard-${k}`} key={k} className={colorMap.get(k)} onClick={() => handleGameEvent({key:k})}>{k}</div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export default WordleKeyboard;
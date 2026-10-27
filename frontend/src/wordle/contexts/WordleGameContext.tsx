import React, { useEffect } from "react";
import axios from "axios";

interface WordleGameContextType {
    guesses: string[][];
    colors: string[][];
    colorMap: Map<string, string>;
    handleGameEvent: (event: any) => void;

    modalStatus: boolean;
    setModalStatusFalse: () => void;
    modalMessage: string;

    date: Date;

    stats: {attempts: number[], failed: number, latestIdx: number};

    takingInput: boolean;
}

const WordleGameContext = React.createContext<WordleGameContextType>({
    guesses: [],
    colors: [],
    colorMap: new Map(),
    handleGameEvent: () => { },

    modalStatus: false,
    setModalStatusFalse: () => {},
    modalMessage: '',

    date: new Date(),

    stats: {attempts: [0, 0, 0, 0, 0, 0], failed: 0, latestIdx: 0},

    takingInput: true
});
export function useWordleGameContext() {
    return React.useContext(WordleGameContext);
}

export function WordleGameContextProvider(props:
    {
        children: React.ReactNode,
        withCache?: boolean,
        validateWordFn?: (word: string) => { isInvalid: boolean, hasWon: boolean, answerColors: string[] },
        getDailyWordFn?: () => string,
    }) {

    const API_URL = "http://localhost:8080/wordle";

    // First 5 columns are guesses, last column is whether the row has been guessed
    const defaultGuesses = [
        ["", "", "", "", "", "no"],
        ["", "", "", "", "", "no"],
        ["", "", "", "", "", "no"],
        ["", "", "", "", "", "no"],
        ["", "", "", "", "", "no"],
        ["", "", "", "", "", "no"],
    ];

    const defaultColors = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
    ];

    const flipColors = [
        ["flip", "flip", "flip", "flip", "flip"],
        ["flip", "flip", "flip", "flip", "flip"],
        ["flip", "flip", "flip", "flip", "flip"],
        ["flip", "flip", "flip", "flip", "flip"],
        ["flip", "flip", "flip", "flip", "flip"],
        ["flip", "flip", "flip", "flip", "flip"],
    ];

    const defaultColorMap = new Map([
        ['A', "empty"],
        ['B', "empty"],
        ['C', "empty"],
        ['D', "empty"],
        ['E', "empty"],
        ['F', "empty"],
        ['G', "empty"],
        ['H', "empty"],
        ['I', "empty"],
        ['J', "empty"],
        ['K', "empty"],
        ['L', "empty"],
        ['M', "empty"],
        ['N', "empty"],
        ['O', "empty"],
        ['P', "empty"],
        ['Q', "empty"],
        ['R', "empty"],
        ['S', "empty"],
        ['T', "empty"],
        ['U', "empty"],
        ['V', "empty"],
        ['W', "empty"],
        ['X', "empty"],
        ['Y', "empty"],
        ['Z', "empty"],
    ]);

    const defaultStats = { 
        attempts: [0, 0, 0, 0, 0, 0],
        failed: 0,
        latestIdx: 0,
    };

    //adding this variable because for some reason localStorage.getItem("guesses") doesn't work in the t/f statement in the line below
    const storedGuesses = props.withCache ? localStorage.getItem("guesses") : null;
    const [guesses, setGuesses] = React.useState(storedGuesses ? JSON.parse(storedGuesses) : defaultGuesses);

    const storedColors = props.withCache ? localStorage.getItem("colors") : null
    const [colors, setColors] = React.useState(storedColors ? JSON.parse(storedColors) : flipColors); //colors will be reset, flip just does the flip animation.
    //i had to make flip separate because otherwise it would play after my shake animation

    const storedGameOver = localStorage.getItem("gameOver");
    const [gameOver, setGameOver] = React.useState(storedGameOver ? storedGameOver : false);

    const storedTakingInput = props.withCache ? localStorage.getItem("takingInput") : null;
    const [takingInput, setTakingInput] = React.useState(storedGameOver && storedGameOver === "false" ? true : storedTakingInput ? storedTakingInput === "true" : true);
    const [modalStatus, setModalStatus] = React.useState(storedTakingInput ? storedTakingInput === "false" : false);
    const [modalMessage, setModalMessage] = React.useState(takingInput ? "Welcome back!\nPress any key to continue" 
        : "Welcome back!\nThere still isn't a new word available, come back tomorrow");

    const storedColorMap = props.withCache ? localStorage.getItem("colorMap") : null;
    const [colorMap, setColorMap] = React.useState(storedColorMap ? new Map<string, string>(JSON.parse(storedColorMap)) : defaultColorMap);

    const storedDate = localStorage.getItem("date");
    const [date, setDate] = React.useState(storedDate ? new Date(storedDate) : new Date())

    const storeStats = localStorage.getItem("stats");
    const [stats, setStats] = React.useState(storeStats ? JSON.parse(storeStats) : defaultStats);

    //disables first keyboard input after daily reset modal
    let firstInputUponReset = true;

    /**
     * Helper function that finds the next empty cell in the grid to fill in
     * @returns [row, col] - The row and column of the next empty cell
     */
    const findNextEmpty = (): [number, number] => {
        // Get the next row with "yes" in the last column
        let row = 0;
        for (let i = 0; i < 6; i++) {
            if (guesses[i][5] === "no") {
                row = i;
                break;
            }
        }

        for (let i = 0; i < 6; i++) {
            if (guesses[row][i] === "") {
                return [row, i];
            }
        }
        return [row, -1];
    }

    /**
     * Sends the word to the backend for validation
     * @param word 
     * @returns isInvalid - Boolean if the word is valid (in backend's dictionary)
     * @returns hasWon - Boolean if the word is correct
     * @returns answerColors - Array of colors for each letter in the word
     */
    const sendWordForValidation = async (word: string) => {
        //return { isInvalid: false, hasWon: false, answerColors: ["correct", "correct", "almost", "error", "error"] }
        if (props.validateWordFn) {
            return props.validateWordFn(word);
        }
        let res;
        try {
            res = await axios.get(API_URL + `/guess/${word}`);
        } catch {
            return { isInvalid: true, hasWon: false, answerColors: ["error", "error", "error", "error", "error"] };
        }
        
        if (res.status !== 200) {
            return { isInvalid: true, hasWon: false, answerColors: ["error", "error", "error", "error", "error"] };
        }

        const data = res.data;

        const converter = { "Grey": "error", "Yellow": "almost", "Green": "correct" };
        
        const answerColors = data["Guess Result"].map((color: "Grey" | "Yellow" | "Green") => converter[color]);

        const returnObj = {
            isInvalid: !data["Word Valid"],
            hasWon: data["Guess Result"].every((color: string) => color === "Green"),
            answerColors
        }
        return returnObj;
    }

    /**
     * Sends an API call to get the daily word
     * @returns the daily 5 letter word as a string
     */
    const getDailyWord = async () => {
        if (props.getDailyWordFn) {
            return props.getDailyWordFn();
        }
        const res = await axios.get(API_URL + "/reveal");

        return res.data.word;
    }

    /**
     * Method responsible for getting an event (key or WordleKeyboard press) and updating the game state accordingly
     * 
     * @param event Object with the key pressed 
     */
    const handleGameEvent = async (event: any) => {
        setModalStatus(false)
        if (!takingInput || guesses[5][5] === "yes" || (firstInputUponReset && modalStatus)) {
            firstInputUponReset = false;
            return;
        }

        // Find what slot in the grid we're dealing with
        const [currentRow, currentCol] = findNextEmpty();
        // If enter is pressed, move to the next row
        if (event.key === "Enter" || event.key === "RET") {
            // If currentCol is -1, we're at the end of the row
            if (currentCol < 0) {
                const submittingWord = guesses[currentRow].slice(0, -1).join("");
                const { isInvalid, hasWon, answerColors } = await sendWordForValidation(submittingWord);

                if (isInvalid) {
                    setModalMessage("Word is not in our dictionary, try another one!\n Press anything to continue");
                    setModalStatus(true);
                    return;
                }
                
                if (hasWon) {
                    setTakingInput(false);
                    stats.attempts[currentRow] += 1;
                    stats.latestIdx = currentRow;
                    setStats(stats);
                    localStorage.setItem("stats", JSON.stringify(stats));
                }

                else if (currentRow === 5) {
                    setTakingInput(false);
                    stats.failed += 1;
                    stats.latestIdx = currentRow + 1;
                    setStats(stats);
                    localStorage.setItem("stats", JSON.stringify(stats));
                }
                setTakingInput(false);

                const newGuesses = [...guesses];
                newGuesses[currentRow][5] = "yes";
                setGuesses(newGuesses);

                const newColors = [...colors];
                newColors[currentRow] = answerColors;

                const animateLetters = ["shakepop", "shakepop", "shakepop", "shakepop", "shakepop"];
                const newColors2 = [...colors];
                newColors2[currentRow] = animateLetters;
                setColors(newColors2);

                const animateLetters2 = ["shakepop ", "shakepop ", "shakepop ", "shakepop ", "shakepop "];

                for (let i = 0; i < 5; i ++){
                    animateLetters2[i] = "shakepop" + answerColors[i];
                }
                const newColors3 = [...colors];
                newColors3[currentRow] = animateLetters2;

                setTimeout(()=>{
                    setColors(newColors3);
                }, 500)

                setTimeout(()=>{
                    setColors(newColors);
                    if(!(hasWon || currentRow === 5)){
                        setTakingInput(true);
                    }
                }, 2200)
                localStorage.setItem("colors", JSON.stringify(newColors));

                const colorMapBackup = new Map(colorMap)

                // Given each row, update the colors of the letters
                const newColorMap = new Map(colorMap);
                for(let i = 0; i < 5; i ++) {
                    newColorMap.set(guesses[currentRow][i], "shakepop " + colorMap.get(guesses[currentRow][i]));
                }
                setColorMap(newColorMap);

                const newColorMap2  = new Map(newColorMap);
                for (let i = 0; i < 5; i++) {
                    // We only want to update if the color value is "higher" than the current value
                    // For example, empty -> almost -> correct
                    if (answerColors[i] === "correct" || (answerColors[i] === "almost" && colorMapBackup.get(guesses[currentRow][i]) !== "correct" && !newColorMap2.get(guesses[currentRow][i])?.includes("correct"))
                        || (answerColors[i] === "error" && (newColorMap2.get(guesses[currentRow][i]) === "shakepop empty" || newColorMap2.get(guesses[currentRow][i]) === "shakepop error"))
                    ) {
                        newColorMap2.set(guesses[currentRow][i], "shakepop " + answerColors[i]);
                    }
                    else if(answerColors[i] === "error" && !(newColorMap2.get(guesses[currentRow][i]) === "shakepop empty" || newColorMap2.get(guesses[currentRow][i]) === "shakepop error")){

                    }
                    else if(answerColors[i] === "almost" && colorMapBackup.get(guesses[currentRow][i]) === "correct" || newColorMap2.get(guesses[currentRow][i]) === "shakepop correct"){
                        newColorMap2.set(guesses[currentRow][i], "shakepop correct");
                    }
                    else{
                        let str = colorMapBackup.get(guesses[currentRow][i]);
                        newColorMap2.set(guesses[currentRow][i], str ? "shakepop " + str : "");
                    }
                }

                setTimeout(()=>{
                    setColorMap(newColorMap2);
                }, 500)

                const newColorMap3  = new Map(newColorMap2);
                for (let i = 0; i < 5; i++) {
                    // We only want to update if the color value is "higher" than the current value
                    // For example, empty -> almost -> correct
                    if (answerColors[i] === "correct" || (answerColors[i] === "almost" && colorMapBackup.get(guesses[currentRow][i]) !== "correct" && !newColorMap3.get(guesses[currentRow][i])?.includes("correct"))
                        || (answerColors[i] === "error" && (newColorMap3.get(guesses[currentRow][i]) === "shakepop empty" || newColorMap3.get(guesses[currentRow][i]) === "shakepop error"))
                    ) {
                        newColorMap3.set(guesses[currentRow][i], answerColors[i]);
                    }
                    else if(answerColors[i] === "error" && !(newColorMap2.get(guesses[currentRow][i]) === "shakepop empty" || newColorMap3.get(guesses[currentRow][i]) === "shakepop error")){

                    }
                    else if(answerColors[i] === "almost" && colorMapBackup.get(guesses[currentRow][i]) === "correct" || newColorMap3.get(guesses[currentRow][i])?.includes("correct")){
                        newColorMap3.set(guesses[currentRow][i], "correct");
                    }
                    else{
                        let str = colorMapBackup.get(guesses[currentRow][i]);
                        newColorMap3.set(guesses[currentRow][i], str ? str : "");
                    }
                }

                setTimeout(()=>{
                    setColorMap(newColorMap3);
                }, 1500)
                localStorage.setItem("colorMap", JSON.stringify(Array.from(newColorMap3.entries())));
                // Timeout for the modal to wait for the animation to finish
                setTimeout(async () => {
                    // If correct, display message on modal
                    if (hasWon) {
                        setModalMessage("You won!\n Press anything to continue");
                        setModalStatus(true);
                        setTakingInput(false);
                    }
                    // Same for lost
                    else if (currentRow === 5) {
                        const dailyWord = await getDailyWord();
                        setModalMessage("You lost! The word was " + dailyWord + "\n Press anything to continue");
                        setModalStatus(true);
                        setTakingInput(false);
                    }
                }, 2200)

                //no delay
                if (hasWon) {
                    setGameOver(true);
                }
                else if (currentRow === 5) {
                    setGameOver(true);
                }
            }
        }

        // If backspace is pressed, move to the previous column
        if (event.key === "Backspace" || event.key === "DEL") {
            const newGuesses = [...guesses];
            if (currentCol === 0) {
                return;
            }
            const actualCol = currentCol < 0 ? 5 : currentCol;
            newGuesses[currentRow][actualCol - 1] = "";
            setGuesses(newGuesses);

        }

        // If a letter is pressed, update the current cell
        if (event.key.length === 1 && event.key.match(/[a-zA-Z]/i)) {
            const newGuesses = [...guesses];
            if (currentCol < 0) {
                return;
            }
            newGuesses[currentRow][currentCol] = event.key.toUpperCase();
            setGuesses(newGuesses);
        }
    }

    const setModalStatusFalse = () => {
        setModalStatus(false);
        firstInputUponReset = false;
    }

    //must use useEffect hook to keep up with React updates
    useEffect(() => {
        localStorage.setItem("guesses", JSON.stringify(guesses));
    }, [guesses])
/** 
    useEffect(() => {
        localStorage.setItem("colors", JSON.stringify(colors));
    }, [colors])

    useEffect(() => {
        localStorage.setItem("colorMap", JSON.stringify(Array.from(colorMap.entries())));
    }, [colorMap])
*/
    useEffect(() => {
        localStorage.setItem("date", date.toISOString());
    }, [date])

    useEffect(() => {
        localStorage.setItem("takingInput", takingInput.toString());
    }, [takingInput])

    useEffect(() => {
        localStorage.setItem("gameOver", gameOver.toString());
    }, [gameOver])

    useEffect(() => {
        if (date.getDate() !== (new Date()).getDate()) {
            localStorage.clear();
            setModalMessage("A new day! Your answer has been reset\nPress anything to continue");
            setModalStatus(true);
            setColors(defaultColors);
            setColors(flipColors);
            setGuesses(defaultGuesses);
            setColorMap(defaultColorMap);
            setTakingInput(true);
            setGameOver(false);
            firstInputUponReset = true;
            setDate(new Date());
        }
    });


    const value: WordleGameContextType = {
        guesses,
        colors,
        colorMap,
        handleGameEvent,
        modalMessage,
        modalStatus,
        setModalStatusFalse,
        date,
        stats,
        takingInput
    }

    return (
        <WordleGameContext.Provider value={value}>
            {props.children}
        </WordleGameContext.Provider>
    )
}
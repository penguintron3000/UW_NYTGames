import React from "react";
import axios from "axios";

interface ConnectionsGameContextType {
    cards:string[],
    selectedCards:string[],
    setSelectedCards: (selectedCards: string[]) => void,
    validatedCards:Map<string, string>,
    attemptsCount: boolean[],
    handleSubmit: () => void,
    modalMessage: string,
    modalStatus: boolean,
    setModalStatusFalse: () => void,
    topics: string[]
}

export const ConnectionsGameContext = React.createContext<ConnectionsGameContextType>({
    cards: [],
    selectedCards: [],
    setSelectedCards: () => {},
    validatedCards: new Map(),
    attemptsCount: [],
    handleSubmit: () => {},
    modalMessage: "",
    modalStatus: false,
    setModalStatusFalse: () => {},
    topics: []
});
export function useConnectionsGameContext() {
    return React.useContext(ConnectionsGameContext);
}
export default ConnectionsGameContextProvider;
export function ConnectionsGameContextProvider(props:
    {
        children: React.ReactNode,
        withCache?: boolean,
        loadCardsFn?: () => string[],
        submitToVerifyFn?: () => {data: boolean},
    }) {

    const API_URL = "http://localhost:8080";

    const defaultAttempts = [true, true, true, true];
    const defaultTopics = ["", "", "", ""];

    const storedCards = props.withCache ? localStorage.getItem("connections.cards") : null;
    const [cards, setCards] = React.useState<string[]>(storedCards ? JSON.parse(storedCards) : []);

    const [selectedCards, setSelectedCards] = React.useState<string[]>([]);

    const storedValidatedCards = props.withCache ? localStorage.getItem("connections.validated") : null;
    const [validatedCards, setValidatedCards] = React.useState(storedValidatedCards ? new Map<string, string>(JSON.parse(storedValidatedCards)) : new Map())

    const storedAttempts = props.withCache ? localStorage.getItem("connections.attempts") : null;
    const [attemptsCount, setAttemptsCount] = React.useState<boolean[]>(storedAttempts ? JSON.parse(storedAttempts) : defaultAttempts);

    //counts how many rows have been discovered
    const storedCount = props.withCache ? localStorage.getItem("countToFour") : null;
    const [countToFour, setCountToFour] = React.useState(storedCount ? parseInt(JSON.parse(storedCount)) : 0);

    const [modalStatus, setModalStatus] = React.useState(countToFour === 4 || attemptsCount.every((attempt) => !attempt) ? true : false);
    const [modalMessage, setModalMessage] = React.useState(countToFour === 4 || attemptsCount.every((attempt) => !attempt) ? "Welcome back!\nThere still isn't a new set of phrases available, come back tomorrow"
        : "Welcome!\nPress any key to continue");

    const storedDate = localStorage.getItem("date");
    const [date, setDate] = React.useState(storedDate ? new Date(storedDate) : new Date())

    const storedTopics = localStorage.getItem("connections.topics");
    const [topics, setTopics] = React.useState<string[]>(storedTopics ? JSON.parse(storedTopics) : defaultTopics);

    const [firstClickUponNewDay, setFirstClickUponNewDay] = React.useState(false);

    /**
     * Requests to the backend an array of cards to be displayed on the game board.
     */
    const loadCards = async () => {
    if (props.loadCardsFn) {
        setCards(props.loadCardsFn());
        return;
    }

    
    if (cards.length !== 0) return;
    console.log("cards.length:", cards.length);
    try {
        console.log("waiting for api");
        const response = await axios.get(`${API_URL}/connections/randomize?ts=${Date.now()}`);
        console.log("API response:", response.data);

        const newCards = response.data["Randomized Words"];
        const newValidatedMap = new Map();
        for (let i = 0; i < 16; i++) {
            newValidatedMap.set("Card " + i, "");
        }
        setCards(newCards);

        if (validatedCards.size === 0) {
            setValidatedCards(newValidatedMap);
        }
    } catch (err) {
        console.error("Error fetching cards:", err);
    }
};

    const swapCardsValues = async () =>{
        const newCards = [...cards];
        var index = 0;
        const toAnimate = [];
        for(var i = 0; i < selectedCards.length; i ++){
            for(var j = 0; j < newCards.length; j ++){
                if(newCards[j] == selectedCards[i]){
                    toAnimate[index] = (newCards[countToFour * 4 + index]);
                    index++;
                    break;
                }
            }
        }
        return toAnimate;
    }

    const swapCards = async () =>{
        const newCards = [...cards];
        var index = 0;
        for(var i = 0; i < selectedCards.length; i ++){
            for(var j = 0; j < newCards.length; j ++){
                if(newCards[j] == selectedCards[i]){
                    newCards[j] = newCards[countToFour * 4 + index];
                    newCards[countToFour * 4 + index] = selectedCards[i];
                    index++;
                    break;
                }
            }
        }
        setCards(newCards);
    }

    const animateGrid = async (topicName: string, topicDifficulty: number) =>{
        //animates the cards
        let newValidatedMap = new Map(validatedCards);
            const swapped = await swapCardsValues();
            const newArr = swapped.concat(selectedCards);

            newArr.map((m)=>{
                newValidatedMap.set(m, "smaller");
                if(selectedCards.includes(m)){
                    newValidatedMap.set(m, "smaller" + " clicked");
                }
            })

            setSelectedCards([]);
            setValidatedCards(newValidatedMap);
            //creating new copies to because we are passing by reference
            let newValidatedMap2 = new Map(newValidatedMap)

            newArr.map((m)=>{
                if(selectedCards.includes(m)){
                    newValidatedMap2.set(m, "level" + topicDifficulty + " bigger");
                }
                else{
                    newValidatedMap2.set(m, "bigger");
                }
            })

            setTimeout(()=>{
                swapCards();
                setValidatedCards(newValidatedMap2)
            }, 500)

            let newValidatedMap3 = new Map(validatedCards);
            //removing bigger and smaller so that it does not animate again upon refresh, something I will have to tackle in wordle
            newArr.map((m)=>{
                newValidatedMap3.set(m, "");
                if(selectedCards.includes(m)){
                    newValidatedMap3.set(m, "level" + topicDifficulty);
                }
            })

            setTimeout(()=>{
                setValidatedCards(newValidatedMap3)
            }, 1000)

            //everything below animates the topic name
            let topicIndex = 0;

            //temp fix, to the name delay, if topicName shares the same name as a css class it will take upon css elements, but there shouldnt be any real topic names that
            //coincide with a css class
            const temp = [...topics]
            topicIndex = temp.indexOf("");
            temp[topicIndex] = topicName + " bigger " + "level" + topicDifficulty;

            setTimeout(()=>{
                console.log(temp)
                setTopics(temp);
            }, 500)

            const temp2 = [...topics]
            temp2[topicIndex] = topicName;

            setTimeout(()=>{
                setTopics(temp2);
                localStorage.setItem("connections.topics", JSON.stringify(temp2));
            }, 1000)
    }

    /**
     * Ran when submit button is clicked. Sends the selected cards to the backend to check if they are correct.
     */
    const handleSubmit = async () => {
        
        if(countToFour === 4 || attemptsCount.every((attempt) => !attempt)){
            return;
        }

        if (selectedCards.length !== 4) {
            setModalMessage("Please select 4 cards");
            setModalStatus(true);
            return;
        }

        let response;
        if (props.submitToVerifyFn) {
            response = props.submitToVerifyFn();
        } 
        else {
            // Placeholder for the response from the backend.
            response = await axios.post(`${API_URL}/connections/guess?ts=${Date.now()}`, selectedCards);
        }
        console.log(response.data);


        if (response.data["Status"] === "CORRECT") {
            //added this variable because countToFour is lagging one state behind
            var inc = countToFour + 1;
            setCountToFour(inc);
            if(inc === 4){
                setModalMessage("You Win!");
            }
            else{
                setModalMessage("Correct!"); 
            }
            setModalStatus(true);
            animateGrid(response.data["Category"], response.data["Level"]);
        } else {
            if (response.data["Status"] === "ONE AWAY") {
                setModalMessage("One away...");
            } else {
                setModalMessage("Incorrect!");
            }
            setModalStatus(true);
            const tmp = [...attemptsCount];
            tmp[tmp.lastIndexOf(true)] = false;
            setAttemptsCount(tmp);
            localStorage.setItem("connections.attempts", JSON.stringify(tmp));

            if (tmp.every((attempt) => !attempt)) {
                setModalMessage("Game Over!");
                setModalStatus(true);
            }
        }
    }

    /**
     * Loads cards on component mount.
     */
    React.useEffect(() => {
        loadCards();
    }, []);

    React.useEffect(()=>{
        localStorage.setItem("connections.validated", JSON.stringify(Array.from(validatedCards.entries())))
    }, [validatedCards])

    React.useEffect(()=>{
        localStorage.setItem("countToFour", JSON.stringify(countToFour))
    }, [countToFour])

    const setModalStatusFalse = () => {
        setModalStatus(false);
        if(firstClickUponNewDay){
            setFirstClickUponNewDay(false);
            window.location.reload();
        }
    }

    React.useEffect(() => {
        localStorage.setItem("date", date.toISOString());
    }, [date])

    React.useEffect(() => {
        localStorage.setItem("connections.cards", JSON.stringify(cards))
    }, [cards])

    React.useEffect(() => {
        if (date.getDate() !== (new Date()).getDate()) {
            localStorage.clear();
            setModalMessage("A new day! Your answer has been reset");
            setModalStatus(true);
            setDate(new Date());
            loadCards();
            setFirstClickUponNewDay(true);
        }
    });

    const value: ConnectionsGameContextType = {
        cards,
        selectedCards,
        setSelectedCards,
        validatedCards,
        attemptsCount,
        handleSubmit,
        modalMessage,
        modalStatus,
        setModalStatusFalse,
        topics
    }

    return (
        <ConnectionsGameContext.Provider value={value}>
            {props.children}
        </ConnectionsGameContext.Provider>
    )
}
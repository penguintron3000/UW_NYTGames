import { useWordleGameContext } from "../contexts/WordleGameContext";

function WordleStats() {
    const { stats, colors } = useWordleGameContext();
    const attempts = stats.attempts;
    const played = attempts.reduce((acc, value) => acc + value, 0);
    const totalGames = stats.failed + played;

    const copyColors = () => {
        const converter = {
            "correct": "🟩",
            "almost": "🟨",
            "error": "⬛"
        };

        // Make copyText a string of emojis, with newlines between each row
        let copyText = "";
        for (let i = 0; i < colors.length; i++) {
            if (colors[i][0] === "") {
                break;
            }
            // @ts-ignore
            copyText += colors[i].map((color) => converter[color]).join("") + "\n";
        }

        navigator.clipboard.writeText(copyText);
    };

    // Display number in a bar graph
    return (
        <>
            <h2 style={{ textAlign:"center", fontFamily: 'Helvetica' }}>Guess Distribution</h2>
            <table style={{ width: "100%" }}>
                <tbody>
                    {attempts.map((attempt, index) => {
                        return (
                            <tr key={index}>
                                <td style={{ width: "5%", textAlign:"center" }}>
                                    {index+1}:
                                </td>
                                <td style={{ padding: "5px", fontFamily: 'Helvetica' }}>
                                    <div className="bar" style={{
                                        color: "white",
                                        width: `${Math.max(4, (Math.floor((attempt / totalGames) * 100) + 4)).toString()}%`,
                                        backgroundColor: `${(index === stats.latestIdx) ? "green" : "grey"}`,
                                        padding: "2px",
                                    }}>
                                        {attempt}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    <tr key='failed'>
                        <td style={{ width: "5%", textAlign:"center"  }}>
                            😭
                        </td>
                        <td style={{ padding: "5px", fontFamily: 'Helvetica' }}>
                            <div className="bar" style={{
                                color: "white",
                                width: `${Math.max(4, (Math.floor((stats.failed / totalGames) * 100) + 4)).toString()}%`,
                                backgroundColor: stats.latestIdx === 6 ? "red" : "grey",
                                padding: "2px",
                            }}>
                                {stats.failed}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr></hr>
            <button onClick={copyColors}>
                Copy today's attempt to clipboard
            </button>
        </>
    );

}

export default WordleStats;


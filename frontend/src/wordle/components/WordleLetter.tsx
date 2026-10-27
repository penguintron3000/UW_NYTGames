function WordleLetter(props: { letter: string; letterId: string }) {
    const { letter, letterId } = props;
    return (
        <div className={`${"letter"} ${letterId}`}>
            {letter}
        </div>
    );
}

export default WordleLetter;
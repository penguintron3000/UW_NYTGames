// @jest-environment jsdom
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WordlePage from './WordlePage'
import { WordleGameContextProvider } from './contexts/WordleGameContext';
import { act } from 'react';
import { DarkModeProvider } from '../header/contexts/useDarkMode';

// Constants
const BACKSPACE = '{Backspace}';
const ENTER = '{Enter}';
const KEYBOARD_LABEL = 'keyboard-';
const BOARD_ROW_LABEL = 'board-row-';

const validateMock = vi.fn();
const dailyWordMock = vi.fn();

beforeEach(() => {
  cleanup();
  // Mock localStorage to avoid errors
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  vi.spyOn(Storage.prototype, 'setItem').mockReturnValue();
  Storage.prototype.removeItem = vi.fn();
  validateMock.mockReturnValue({ isInvalid: false, hasWon: false, answerColors: ["correct", "correct", "almost", "error", "error"] });
  dailyWordMock.mockReturnValue('HELLO');

  render(
    <DarkModeProvider>
      <WordleGameContextProvider withCache={false} validateWordFn={validateMock} getDailyWordFn={dailyWordMock}>
        <WordlePage />
      </WordleGameContextProvider>
    </DarkModeProvider>
  );
});

afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * Tests for the Wordle Input functionality
 * Focuses in testing if the keyboard and the buttons work as expected
 */
describe('Input tests', () => {
  it('renders a letter when a button is pressed', async () => {
    const letter = 'A';
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(KEYBOARD_LABEL + letter));
    const firstLetter = screen.getByLabelText(BOARD_ROW_LABEL + '0').firstChild;
    expect(firstLetter?.textContent).toBe(letter);
  });

  it('renders a letter when a key is pressed', async () => {
    const letter = 'A';
    const user = userEvent.setup();
    await user.keyboard(letter);
    const firstLetter = screen.getByLabelText(BOARD_ROW_LABEL + '0').firstChild;
    expect(firstLetter?.textContent).toBe(letter);
  });

  it('does not render a letter when a non-letter key is pressed', async () => {
    const letter = '1';
    const user = userEvent.setup();
    await user.keyboard(letter);
    const letters = screen.getByLabelText(BOARD_ROW_LABEL + '0').childNodes;
    letters.forEach((letter) => {
      expect(letter.textContent).toBe('');
    });
  });

  it('stops rendering letters when the row is full', async () => {
    const user = userEvent.setup();
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (const letter of letters) {
      await user.keyboard(letter);
    }
    const row = screen.getByLabelText(BOARD_ROW_LABEL + '0');
    for (let i = 0; i < row.childNodes.length - 1; i++) {
      expect(row.childNodes[i].textContent).toBe(letters[i]);
    }
  });
})

/**
 * Tests for the Wordle Delete functionality
 * Focuses in testing if the Backspace key and the DEL button work as expected
 */
describe('Delete tests', () => {
  it('deletes a letter when backspace button is pressed ', async () => {
    const letter = 'A';
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(KEYBOARD_LABEL + letter));
    await user.click(screen.getByLabelText(KEYBOARD_LABEL + 'DEL'));
    const firstLetter = screen.getByLabelText(BOARD_ROW_LABEL + '0').firstChild;
    expect(firstLetter?.textContent).toBe('');
  });

  it('deletes a letter when backspace key is pressed ', async () => {
    const letter = 'A';
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(KEYBOARD_LABEL + letter));
    await user.keyboard(BACKSPACE);
    const firstLetter = screen.getByLabelText(BOARD_ROW_LABEL + '0').firstChild;
    expect(firstLetter?.textContent).toBe('');
  });

  it('does nothing when backspace key is pressed on an empty cell', async () => {
    const user = userEvent.setup();
    await user.keyboard(BACKSPACE);
    const firstLetter = screen.getByLabelText(BOARD_ROW_LABEL + '0').firstChild;
    expect(firstLetter?.textContent).toBe('');
  });

  it('does nothing when backspace button is pressed on an empty cell', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(KEYBOARD_LABEL + 'DEL'));
    const firstLetter = screen.getByLabelText(BOARD_ROW_LABEL + '0').firstChild;
    expect(firstLetter?.textContent).toBe('');
  });
});

/**
 * Tests for the Wordle Submit functionality
 * Focuses in testing if the Submit button works as expected
 */
describe('Submit tests', () => {
  it('submits the word when the submit button is pressed', async () => {
    const user = userEvent.setup();
    const letters = ['A', 'B', 'C', 'D', 'E'];
    for (const letter of letters) {
      await user.keyboard(letter);
    }
    await user.keyboard(ENTER);
    expect(validateMock).toHaveBeenCalledWith(letters.join(''));
  });

  it('does not submit the word when the row is not full', async () => {
    const user = userEvent.setup();
    const letters = ['A', 'B', 'C', 'D'];
    for (const letter of letters) {
      await user.keyboard(letter);
    }
    await user.keyboard(ENTER);
    expect(validateMock).not.toHaveBeenCalled();
  });
});

/**
 * Tests for the Wordle game as a whole
 * Focuses in testing the game state and the game result
 */
describe('Game/Functional tests', () => {
  it('moves to the next row when a valid word is submitted', async () => {
    // First we submit a valid word
    const user = userEvent.setup();
    const letters = ['A', 'B', 'C', 'D', 'E'];
    for (const letter of letters) {
      await user.keyboard(letter);
    }
    await user.keyboard(ENTER);
    const row = screen.getByLabelText(BOARD_ROW_LABEL + '1');
    for (let i = 0; i < row.childNodes.length - 1; i++) {
      expect(row.childNodes[i].textContent).toBe('');
    }

    // Now we see if we can't delete the letters from the previous row
    await user.keyboard(BACKSPACE);
    expect(screen.getByLabelText(BOARD_ROW_LABEL + '0').lastChild?.textContent).toBe(letters[letters.length - 1]);
    expect(screen.getByLabelText(BOARD_ROW_LABEL + '1').firstChild?.textContent).toBe('');

    // Lastly we see if new letters are added to the new row
    const newLetters = ['F', 'G', 'H', 'I', 'J'];
    for (const letter of newLetters) {
      await user.keyboard(letter);
    }
    for (let i = 0; i < row.childNodes.length - 1; i++) {
      expect(row.childNodes[i].textContent).toBe(newLetters[i]);
    }
  });

  it('does not move to the next row when an invalid word is submitted', async () => {
    // Mock the validate function to return an invalid word
    validateMock.mockReturnValue({ isInvalid: true, hasWon: false, answerColors: ["correct", "correct", "almost", "error", "error"] });

    // First we submit an invalid word
    const user = userEvent.setup();
    const word = "ABCDE"
    await user.keyboard(word + ENTER);

    const row = screen.getByLabelText(BOARD_ROW_LABEL + '0');
    expect(row.textContent).toBe(word);

    // Now we see if we can delete the letters from the previous row
    await user.keyboard(BACKSPACE);
    expect(screen.getByLabelText(BOARD_ROW_LABEL + '0').lastChild?.textContent).toBe('');
  });

  it('disables input when won', async () => {
    // Mock the validate function to return a winning word
    validateMock.mockReturnValue({ isInvalid: false, hasWon: true, answerColors: ["correct", "correct", "correct", "correct", "correct"] });
    // First we submit a winning word
    const user = userEvent.setup();
    const letters = ['H', 'E', 'L', 'L', 'O'];
    await user.keyboard(letters.join() + ENTER);

    // Now we see if the input is disabled
    await user.keyboard(BACKSPACE);
    expect(screen.getByLabelText(BOARD_ROW_LABEL + '0').lastChild?.textContent).toBe(letters[letters.length - 1]);
    for (let i = 1; i < 6; i++) {
      expect(screen.getByLabelText(BOARD_ROW_LABEL + i).textContent).toBe('');
    }
    await user.keyboard('A');
    for (let i = 0; i < 6; i++) {
      expect(screen.getByLabelText(BOARD_ROW_LABEL + i).textContent).not.toContain('A');
    }
  });

  it('disables input and fetches correct word to reveal when lost', async () => {
    // Exhaust the guesses
    const user = userEvent.setup();
    const word = "HELLO";
    for (let i = 0; i < 6; i++) {
      await user.keyboard(word + ENTER);
      await new Promise((r) => setTimeout(r, 2100)); // Timeout for the animation TODO: Use fake timers?
    }

    // Now we see if the correct word is fetched
    expect(dailyWordMock).toHaveBeenCalled();

    // Now we see if the input is disabled
    await user.keyboard(BACKSPACE);
    await user.keyboard('A');
    for (let i = 0; i < 6; i++) {
      expect(screen.getByLabelText(BOARD_ROW_LABEL + i).textContent).toBe(word);
    }
  });

  it('updates the colors of the board and keyboard letters when a word is submitted', async () => {
    // First we submit a valid word
    const user = userEvent.setup();
    const letters = ['Q', 'W', 'F', 'J', 'M'];
    await user.keyboard(letters.join() + ENTER);

    // Check for the colors of the board
    const row = screen.getByLabelText(BOARD_ROW_LABEL + '0');
    for (let i = 0; i < row.childNodes.length - 1; i++) {
      // @ts-ignore
      expect(row.childNodes[i].classList).toContain(validateMock.mock.results[0].value.answerColors[i]);
    }

    // Check for the colors of the keyboard
    for (const letter of letters) {
      const button = screen.getByLabelText(KEYBOARD_LABEL + letter);
      expect(button.classList).toContain(validateMock.mock.results[0].value.answerColors[letters.indexOf(letter)]);
    }
  });

  it('resets the board when the day changes', async () => {
    const user = userEvent.setup({ delay: null });
    vi.useFakeTimers();

    // Write some letters
    const word = "HELLO";
    user.keyboard(word + ENTER);

    act(() => {
      vi.runAllTimers();
    });

    // Mocking date
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1);
    vi.setSystemTime(tomorrow);

    // Check if the board is reset
    for (let i = 0; i < 6; i++) {
      expect(screen.getByLabelText(BOARD_ROW_LABEL + i).textContent).toBe('');
    }

    vi.useRealTimers();
  });
});